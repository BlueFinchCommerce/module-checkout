<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\Model\Resolver;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Model\MaskedQuoteIdToQuoteIdInterface;
use Magento\Quote\Model\Quote;

class SetAddressesOnCart implements ResolverInterface
{
    /**
     * @param \Magento\QuoteGraphQl\Model\Cart\SetShippingAddressesOnCartInterface $setShippingAddressesOnCart
     * @param \Magento\QuoteGraphQl\Model\Cart\SetBillingAddressOnCart $setBillingAddressOnCart
     * @param \Magento\QuoteGraphQl\Model\Cart\CheckCartCheckoutAllowance $checkCartCheckoutAllowance
     * @param CartRepositoryInterface $cartRepository
     * @param MaskedQuoteIdToQuoteIdInterface $maskedQuoteIdToQuoteId
     */
    public function __construct(
        private readonly \Magento\QuoteGraphQl\Model\Cart\SetShippingAddressesOnCartInterface
        $setShippingAddressesOnCart,
        private readonly \Magento\QuoteGraphQl\Model\Cart\SetBillingAddressOnCart $setBillingAddressOnCart,
        private readonly \Magento\QuoteGraphQl\Model\Cart\CheckCartCheckoutAllowance $checkCartCheckoutAllowance,
        private readonly CartRepositoryInterface $cartRepository,
        private readonly MaskedQuoteIdToQuoteIdInterface $maskedQuoteIdToQuoteId
    ) {
    }

    /**
     * @inheritdoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        if (empty($args['input']['cart_id'])) {
            throw new GraphQlInputException(__('Required parameter "cart_id" is missing'));
        }
        $maskedCartId = $args['input']['cart_id'];

        $shippingAddresses = $args['input']['shipping_addresses'] ?? [];

        if (empty($args['input']['billing_address'])) {
            throw new GraphQlInputException(__('Required parameter "billing_address" is missing'));
        }
        $billingAddress = $args['input']['billing_address'];

        try {
            $cartId = $this->maskedQuoteIdToQuoteId->execute($maskedCartId);
        } catch (NoSuchEntityException $exception) {
            throw new GraphQlNoSuchEntityException(
                __('Could not find a cart with ID "%masked_cart_id"', ['masked_cart_id' => $maskedCartId])
            );
        }

        try {
            /** @var Quote $cart */
            $cart = $this->cartRepository->get($cartId);
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(
                __('Could not find a cart with ID "%masked_cart_id"', ['masked_cart_id' => $maskedCartId])
            );
        }

        $cart->setTotalsCollectedFlag(true);
        $this->checkCartCheckoutAllowance->execute($cart);
        if ($shippingAddresses) {
            $this->setShippingAddressesOnCart->execute($context, $cart, $shippingAddresses);
        }
        $this->setBillingAddressOnCart->execute($context, $cart, $billingAddress);

        return [
            'cart' => [
                'model' => $cart,
            ],
        ];
    }
}
