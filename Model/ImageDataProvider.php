<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Exception;
use Magento\Checkout\CustomerData\DefaultItem;
use Magento\Framework\App\Area;
use Magento\Quote\Api\CartItemRepositoryInterface;
use Magento\Quote\Model\Quote\Item;
use Magento\Store\Model\App\Emulation;
use Magento\Store\Model\StoreManagerInterface;
use Psr\Log\LoggerInterface;

class ImageDataProvider implements DataProviderInterface
{
    /**
     * @param CartItemRepositoryInterface $itemRepository
     * @param DefaultItem $customerDataItem
     * @param LoggerInterface $logger
     * @param Emulation $appEmulation
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        private readonly CartItemRepositoryInterface $itemRepository,
        private readonly DefaultItem $customerDataItem,
        private readonly LoggerInterface $logger,
        private readonly Emulation $appEmulation,
        private readonly StoreManagerInterface $storeManager
    ) {
    }

    /**
     * Return an array of image data
     *
     * @param int $quoteId
     * @return array
     */
    public function getData(
        int $quoteId
    ): array {
        $imageData = [];
        try {
            $items = $this->itemRepository->getList($quoteId);
            $storeId = $this->storeManager->getStore()->getId();
            $this->appEmulation->startEnvironmentEmulation($storeId, Area::AREA_FRONTEND, true);
            foreach ($items as $cartItem) {
                /** @var Item $cartItem */
                $allData = $this->customerDataItem->getItemData($cartItem);
                $imageData[$cartItem->getItemId()]['image'] = $allData['product_image'];
            }
            $this->appEmulation->stopEnvironmentEmulation();
        } catch (Exception $exception) {
            $this->logger->error($exception->getMessage());
        }
        return ['quote' => ['items' => $imageData]];
    }
}
