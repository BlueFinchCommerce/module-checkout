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
use Magento\QuoteGraphQl\Model\Cart\CheckCartCheckoutAllowance;
use Magento\QuoteGraphQl\Model\Cart\SetBillingAddressOnCart;
use Magento\QuoteGraphQl\Model\Cart\SetShippingAddressesOnCartInterface;
use Gene\BetterCheckout\Model\DataCollector;

class SetAddressesOnCart implements ResolverInterface
{
    /**
     * @param SetShippingAddressesOnCartInterface $setShippingAddressesOnCart
     * @param SetBillingAddressOnCart $setBillingAddressOnCart
     * @param CheckCartCheckoutAllowance $checkCartCheckoutAllowance
     * @param CartRepositoryInterface $cartRepository
     * @param MaskedQuoteIdToQuoteIdInterface $maskedQuoteIdToQuoteId
     * @param DataCollector $dataCollector
     */
    public function __construct(
        private readonly SetShippingAddressesOnCartInterface $setShippingAddressesOnCart, // @phpstan-ignore-line
        private readonly SetBillingAddressOnCart $setBillingAddressOnCart, // @phpstan-ignore-line
        private readonly CheckCartCheckoutAllowance $checkCartCheckoutAllowance, // @phpstan-ignore-line
        private readonly CartRepositoryInterface $cartRepository,
        private readonly MaskedQuoteIdToQuoteIdInterface $maskedQuoteIdToQuoteId,
        private readonly DataCollector $dataCollector
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

        $this->checkCartCheckoutAllowance->execute($cart);
        if ($shippingAddresses) {
            // prevent calling of collectTotals and requestShippingRates
            $this->dataCollector->setRatesCollected(true)
                ->setTotalsCollected(true);
            $this->setShippingAddressesOnCart->execute($context, $cart, $shippingAddresses);
        }
        // prevent calling of collectTotals and requestShippingRates
        $this->dataCollector->setRatesCollected(true)
            ->setTotalsCollected(true);
        $this->setBillingAddressOnCart->execute($context, $cart, $billingAddress);
        $cart->collectTotals();
        $cart->getShippingAddress()->collectShippingRates();
        // requestShippingRates must be called in the following availableShippingMethods resolver
        $this->dataCollector->setRatesCollected(false)
            ->setTotalsCollected(false);

        return [
            'cart' => [
                'model' => $cart,
            ],
        ];
    }
}
