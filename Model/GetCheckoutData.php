<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model;

use BlueFinch\Checkout\Api\GetCheckoutDataInterface;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Quote\Model\QuoteRepository;

class GetCheckoutData implements GetCheckoutDataInterface
{
    /**
     * @param SerializerInterface $serializer
     * @param CompositeDataProviderInterface $compositeDataProvider
     * @param ManagerInterface $eventManager
     * @param QuoteRepository $quoteRepository
     */
    public function __construct(
        private readonly SerializerInterface $serializer,
        private readonly CompositeDataProviderInterface $compositeDataProvider,
        private readonly ManagerInterface $eventManager,
        private readonly QuoteRepository $quoteRepository
    ) {
    }

    /**
     * Return checkout data
     *
     * @param string $cartId
     * @return string
     * @throws NoSuchEntityException
     */
    public function execute($cartId): string
    {
        $quote = $this->quoteRepository->get($cartId);
        if ($quote->getId() && $quote->hasItems() && !$quote->getIsActive()) {
            $quote->setIsActive(true)->setReservedOrderId(null);
            $this->quoteRepository->save($quote);
        }

        $result = [
            'error' => 0,
            'result' => $this->compositeDataProvider->getData(
                (int) $cartId
            )
        ];
        $this->eventManager->dispatch(
            'checkout_data_before_return',
            ['return_data' => $result]
        );
        return $this->serializer->serialize($result);
    }
}
