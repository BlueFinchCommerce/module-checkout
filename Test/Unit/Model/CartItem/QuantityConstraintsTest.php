<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Test\Unit\Model\CartItem;

use BlueFinch\Checkout\Model\CartItem\QuantityConstraints;
use Magento\Catalog\Api\Data\ProductExtensionInterface;
use Magento\Catalog\Model\Product;
use Magento\CatalogInventory\Api\Data\StockItemInterface;
use Magento\CatalogInventory\Api\StockRegistryInterface;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Quote\Model\Quote\Item as QuoteItem;
use Magento\Quote\Model\Quote\Item\Option;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class QuantityConstraintsTest extends TestCase
{
    private StockRegistryInterface&MockObject $stockRegistry;
    private QuantityConstraints $subject;

    protected function setUp(): void
    {
        $this->stockRegistry = $this->createMock(StockRegistryInterface::class);
        $this->subject = new QuantityConstraints($this->stockRegistry);
    }

    public function testUsesSimpleProductConstraints(): void
    {
        $item = $this->createQuoteItem(10, 'simple');
        $this->stockRegistry->method('getStockItem')->with(10)->willReturn(
            $this->createStockItem(5.0, 99.0, 2.0)
        );

        self::assertSame(
            ['minimum' => 6.0, 'maximum' => 98.0, 'increment' => 2.0],
            $this->subject->execute($item)
        );
    }

    public function testConfigurableFallsBackToParentIncrement(): void
    {
        $item = $this->createConfigurableQuoteItem(
            $this->createStockItem(10.0, 100.0, 5.0),
            $this->createStockItem(1.0, 80.0, false)
        );

        self::assertSame(
            ['minimum' => 10.0, 'maximum' => 80.0, 'increment' => 5.0],
            $this->subject->execute($item)
        );
    }

    public function testConfigurableUsesStricterParentMaximum(): void
    {
        $item = $this->createConfigurableQuoteItem(
            $this->createStockItem(5.0, 50.0, 5.0),
            $this->createStockItem(12.0, 80.0, 4.0)
        );

        self::assertSame(
            ['minimum' => 12.0, 'maximum' => 48.0, 'increment' => 4.0],
            $this->subject->execute($item)
        );
    }

    private function createQuoteItem(int $productId, string $productType): QuoteItem&MockObject
    {
        $product = $this->createMock(Product::class);
        $product->method('getId')->willReturn($productId);
        $product->method('getTypeId')->willReturn($productType);

        $item = $this->createMock(QuoteItem::class);
        $item->method('getProduct')->willReturn($product);

        return $item;
    }

    private function createConfigurableQuoteItem(
        StockItemInterface $parentStockItem,
        StockItemInterface $selectedStockItem
    ): QuoteItem&MockObject {
        $parentProduct = $this->createProduct(20, Configurable::TYPE_CODE, $parentStockItem);
        $selectedProduct = $this->createProduct(21, 'simple', $selectedStockItem);
        $option = $this->createMock(Option::class);
        $option->method('getProduct')->willReturn($selectedProduct);

        $item = $this->createMock(QuoteItem::class);
        $item->method('getProduct')->willReturn($parentProduct);
        $item->method('getOptionByCode')->with('simple_product')->willReturn($option);

        return $item;
    }

    private function createProduct(
        int $productId,
        string $productType,
        StockItemInterface $stockItem
    ): Product&MockObject {
        $extensionAttributes = $this->createMock(ProductExtensionInterface::class);
        $extensionAttributes->method('getStockItem')->willReturn($stockItem);

        $product = $this->createMock(Product::class);
        $product->method('getId')->willReturn($productId);
        $product->method('getTypeId')->willReturn($productType);
        $product->method('getExtensionAttributes')->willReturn($extensionAttributes);

        return $product;
    }

    private function createStockItem(
        float $minimum,
        float $maximum,
        float|false $increment
    ): StockItemInterface&MockObject {
        $stockItem = $this->createMock(StockItemInterface::class);
        $stockItem->method('getMinSaleQty')->willReturn($minimum);
        $stockItem->method('getMaxSaleQty')->willReturn($maximum);
        $stockItem->method('getQtyIncrements')->willReturn($increment);
        $stockItem->method('getEnableQtyIncrements')->willReturn(
            $increment !== false && $increment > 0.0
        );

        return $stockItem;
    }
}
