<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Plugin\CatalogInventory\Quote;

use BlueFinch\Checkout\Model\CartItem\QuantityConstraints;
use Magento\CatalogInventory\Helper\Data as CatalogInventoryHelper;
use Magento\CatalogInventory\Model\Quote\Item\QuantityValidator;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\Event\Observer;
use Magento\Quote\Model\Quote\Item as QuoteItem;

class ValidateQuantityConstraints
{
    private const ERROR_ORIGIN = 'bluefinch_checkout';
    private const FLOAT_TOLERANCE = 0.000001;

    /**
     * @param QuantityConstraints $quantityConstraints
     */
    public function __construct(
        private readonly QuantityConstraints $quantityConstraints
    ) {
    }

    /**
     * Validate configurable parent constraints after Magento validates the selected simple product.
     *
     * @param QuantityValidator $subject
     * @param mixed $result
     * @param Observer $observer
     * @return mixed
     */
    public function afterValidate(
        QuantityValidator $subject,
        mixed $result,
        Observer $observer
    ): mixed {
        $item = $observer->getEvent()->getData('item');
        if (!$item instanceof QuoteItem
            || $item->getProduct()->getTypeId() !== Configurable::TYPE_CODE
        ) {
            return $result;
        }

        $this->clearErrors($item);
        $constraints = $this->quantityConstraints->execute($item);
        $quantity = (float) $item->getQty();

        if ($quantity < $constraints['minimum']) {
            $this->addError(
                $item,
                CatalogInventoryHelper::ERROR_QTY,
                (string) __('The fewest you may purchase is %1.', $constraints['minimum'] * 1)
            );
        } elseif ($constraints['maximum'] !== null && $quantity > $constraints['maximum']) {
            $this->addError(
                $item,
                CatalogInventoryHelper::ERROR_QTY,
                (string) __('The most you may purchase is %1.', $constraints['maximum'] * 1)
            );
        } elseif (!$this->matchesIncrement($quantity, $constraints['increment'])) {
            $this->addError(
                $item,
                CatalogInventoryHelper::ERROR_QTY_INCREMENTS,
                (string) __(
                    'You can buy this product only in quantities of %1 at a time.',
                    $constraints['increment'] * 1
                )
            );
        }

        return $result;
    }

    /**
     * @param float $quantity
     * @param float $increment
     * @return bool
     */
    private function matchesIncrement(float $quantity, float $increment): bool
    {
        $ratio = $quantity / $increment;

        return abs($ratio - round($ratio)) < self::FLOAT_TOLERANCE;
    }

    /**
     * @param QuoteItem $item
     * @param int $code
     * @param string $message
     * @return void
     */
    private function addError(QuoteItem $item, int $code, string $message): void
    {
        $item->addErrorInfo(self::ERROR_ORIGIN, $code, $message);
        $item->getQuote()->addErrorInfo(
            'qty',
            self::ERROR_ORIGIN,
            $code,
            (string) __('Please correct the quantity for some products.')
        );
    }

    /**
     * @param QuoteItem $item
     * @return void
     */
    private function clearErrors(QuoteItem $item): void
    {
        foreach ([CatalogInventoryHelper::ERROR_QTY, CatalogInventoryHelper::ERROR_QTY_INCREMENTS] as $code) {
            $params = ['origin' => self::ERROR_ORIGIN, 'code' => $code];
            $item->removeErrorInfosByParams($params);
            $item->getQuote()->removeErrorInfosByParams('qty', $params);
        }
    }
}
