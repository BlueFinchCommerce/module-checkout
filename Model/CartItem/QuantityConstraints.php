<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model\CartItem;

use Magento\Catalog\Api\Data\ProductInterface;
use Magento\CatalogInventory\Api\Data\StockItemInterface;
use Magento\CatalogInventory\Api\StockRegistryInterface;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Quote\Model\Quote\Item as QuoteItem;

class QuantityConstraints
{
    /**
     * @param StockRegistryInterface $stockRegistry
     */
    public function __construct(
        private readonly StockRegistryInterface $stockRegistry
    ) {
    }

    /**
     * Return the effective quantity constraints for a quote item.
     *
     * Configurable products use the selected simple product's constraints and
     * fall back to stricter constraints configured on the parent product.
     *
     * @param QuoteItem $item
     * @return array{minimum: float, maximum: float|null, increment: float}
     */
    public function execute(QuoteItem $item): array
    {
        $parentStockItem = $this->getStockItem($item->getProduct());
        if (!$parentStockItem) {
            return $this->getDefaults();
        }

        $selectedStockItem = $this->getSelectedStockItem($item);
        $stockItems = array_filter([$parentStockItem, $selectedStockItem]);
        $increment = $this->resolveIncrement($selectedStockItem, $parentStockItem);
        $minimum = max(
            1.0,
            ...array_map(
                static fn (StockItemInterface $stockItem): float => (float) $stockItem->getMinSaleQty(),
                $stockItems
            )
        );
        $minimum = ceil($minimum / $increment) * $increment;

        $maximums = array_filter(
            array_map(
                static fn (StockItemInterface $stockItem): float => (float) $stockItem->getMaxSaleQty(),
                $stockItems
            ),
            static fn (float $maximum): bool => $maximum > 0.0
        );
        $maximum = $maximums ? floor(min($maximums) / $increment) * $increment : null;

        return [
            'minimum' => $minimum,
            'maximum' => $maximum,
            'increment' => $increment,
        ];
    }

    /**
     * @param QuoteItem $item
     * @return StockItemInterface|null
     */
    private function getSelectedStockItem(QuoteItem $item): ?StockItemInterface
    {
        if ($item->getProduct()->getTypeId() !== Configurable::TYPE_CODE) {
            return null;
        }

        $selectedProduct = $item->getOptionByCode('simple_product')?->getProduct();

        return $selectedProduct instanceof ProductInterface
            ? $this->getStockItem($selectedProduct)
            : null;
    }

    /**
     * @param ProductInterface $product
     * @return StockItemInterface|null
     */
    private function getStockItem(ProductInterface $product): ?StockItemInterface
    {
        $stockItem = $product->getExtensionAttributes()?->getStockItem();
        if ($stockItem instanceof StockItemInterface) {
            return $stockItem;
        }

        if (!$product->getId()) {
            return null;
        }

        try {
            return $this->stockRegistry->getStockItem((int) $product->getId());
        } catch (NoSuchEntityException) {
            return null;
        }
    }

    /**
     * @param StockItemInterface|null $selectedStockItem
     * @param StockItemInterface $parentStockItem
     * @return float
     */
    private function resolveIncrement(
        ?StockItemInterface $selectedStockItem,
        StockItemInterface $parentStockItem
    ): float {
        foreach ([$selectedStockItem, $parentStockItem] as $stockItem) {
            if ($stockItem && $this->hasIncrement($stockItem)) {
                return (float) $stockItem->getQtyIncrements();
            }
        }

        return 1.0;
    }

    /**
     * @param StockItemInterface $stockItem
     * @return bool
     */
    private function hasIncrement(StockItemInterface $stockItem): bool
    {
        $increment = $stockItem->getQtyIncrements();

        return (bool) $stockItem->getEnableQtyIncrements()
            && $increment !== false
            && (float) $increment > 0.0;
    }

    /**
     * @return array{minimum: float, maximum: null, increment: float}
     */
    private function getDefaults(): array
    {
        return [
            'minimum' => 1.0,
            'maximum' => null,
            'increment' => 1.0,
        ];
    }
}
