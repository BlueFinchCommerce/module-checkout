<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Exception;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\GiftMessage\Api\ItemRepositoryInterface;
use Magento\Quote\Api\CartRepositoryInterface;

class GiftMessageDataProvider implements DataProviderInterface
{
    /**
     * @param CartRepositoryInterface $cartRepository
     * @param ItemRepositoryInterface $messageRepository
     */
    public function __construct(
        private readonly CartRepositoryInterface $cartRepository,
        private readonly ItemRepositoryInterface $messageRepository
    ) {
    }

    /**
     * @param int $quoteId
     * @return \array[][]
     * @throws NoSuchEntityException
     */
    public function getData(int $quoteId): array
    {
        $data = [];
        $quote = $this->cartRepository->get($quoteId);
        foreach ($quote->getItems() as $item) {
            try {
                $message = $this->messageRepository->get($quoteId, $item->getItemId());
                if ($message) {
                    $data[$item->getItemId()]['giftMessage']['from'] = $message->getSender();
                    $data[$item->getItemId()]['giftMessage']['to'] = $message->getRecipient();
                    $data[$item->getItemId()]['giftMessage']['message'] = $message->getMessage();
                }
            } catch (Exception $exception) {
                continue;
            }
        }
        return ['quote' => ['items' => $data]];
    }
}
