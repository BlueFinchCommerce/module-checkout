<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Test\Unit\Plugin\CatalogInventory\Quote;

use BlueFinch\Checkout\Model\CartItem\QuantityConstraints;
use BlueFinch\Checkout\Plugin\CatalogInventory\Quote\ValidateQuantityConstraints;
use Magento\Catalog\Model\Product;
use Magento\CatalogInventory\Helper\Data as CatalogInventoryHelper;
use Magento\CatalogInventory\Model\Quote\Item\QuantityValidator;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\DataObject;
use Magento\Framework\Event\Observer;
use Magento\Quote\Model\Quote;
use Magento\Quote\Model\Quote\Item as QuoteItem;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class ValidateQuantityConstraintsTest extends TestCase
{
    private QuantityConstraints&MockObject $quantityConstraints;
    private ValidateQuantityConstraints $subject;

    protected function setUp(): void
    {
        $this->quantityConstraints = $this->createMock(QuantityConstraints::class);
        $this->subject = new ValidateQuantityConstraints($this->quantityConstraints);
    }

    /**
     * @dataProvider invalidQuantityProvider
     */
    public function testAddsExpectedError(
        float $quantity,
        int $expectedCode,
        string $expectedMessage
    ): void {
        $quote = $this->createMock(Quote::class);
        $quote->expects(self::once())->method('addErrorInfo')->with(
            'qty',
            'bluefinch_checkout',
            $expectedCode,
            self::anything()
        );
        $item = $this->createConfigurableItem($quote, $quantity);
        $item->expects(self::once())->method('addErrorInfo')->with(
            'bluefinch_checkout',
            $expectedCode,
            self::callback(
                static fn ($message): bool => str_contains((string) $message, $expectedMessage)
            )
        );
        $this->quantityConstraints->method('execute')->with($item)->willReturn([
            'minimum' => 10.0,
            'maximum' => 30.0,
            'increment' => 5.0,
        ]);

        $this->validate($item);
    }

    /**
     * @return array<string, array{float, int, string}>
     */
    public static function invalidQuantityProvider(): array
    {
        return [
            'below minimum' => [5.0, CatalogInventoryHelper::ERROR_QTY, 'fewest'],
            'above maximum' => [35.0, CatalogInventoryHelper::ERROR_QTY, 'most'],
            'invalid increment' => [21.0, CatalogInventoryHelper::ERROR_QTY_INCREMENTS, 'quantities of 5'],
        ];
    }

    public function testAllowsQuantityMatchingConstraints(): void
    {
        $quote = $this->createMock(Quote::class);
        $quote->expects(self::never())->method('addErrorInfo');
        $item = $this->createConfigurableItem($quote, 20.0);
        $item->expects(self::never())->method('addErrorInfo');
        $this->quantityConstraints->method('execute')->with($item)->willReturn([
            'minimum' => 10.0,
            'maximum' => 30.0,
            'increment' => 5.0,
        ]);

        $this->validate($item);
    }

    private function validate(QuoteItem $item): void
    {
        $this->subject->afterValidate(
            $this->createMock(QuantityValidator::class),
            null,
            new Observer(['event' => new DataObject(['item' => $item])])
        );
    }

    private function createConfigurableItem(Quote $quote, float $quantity): QuoteItem&MockObject
    {
        $product = $this->createMock(Product::class);
        $product->method('getTypeId')->willReturn(Configurable::TYPE_CODE);

        $item = $this->createMock(QuoteItem::class);
        $item->method('getProduct')->willReturn($product);
        $item->method('getQty')->willReturn($quantity);
        $item->method('getQuote')->willReturn($quote);

        return $item;
    }
}
