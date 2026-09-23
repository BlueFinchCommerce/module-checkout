<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model\Resolver\CartItem;

use BlueFinch\Checkout\Model\CartItem\QuantityConstraints as QuantityConstraintsService;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Quote\Model\Quote\Item as QuoteItem;

class QuantityConstraints implements ResolverInterface
{
    /**
     * @param QuantityConstraintsService $quantityConstraints
     */
    public function __construct(
        private readonly QuantityConstraintsService $quantityConstraints
    ) {
    }

    /**
     * @inheritDoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        ?array $value = null,
        ?array $args = null
    ): array {
        $item = $value['model'] ?? null;
        if (!$item instanceof QuoteItem) {
            throw new LocalizedException(__(
                'The cart item model must be an instance of %1.',
                QuoteItem::class
            ));
        }

        return $this->quantityConstraints->execute($item);
    }
}
