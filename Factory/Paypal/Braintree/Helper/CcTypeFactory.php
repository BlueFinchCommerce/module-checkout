<?php
declare(strict_types=1);

namespace BlueFinch\Checkout\Factory\Paypal\Braintree\Helper;

use Magento\Framework\ObjectManagerInterface;
use PayPal\Braintree\Helper\CcType;

class CcTypeFactory
{
    /**
     * @param ObjectManagerInterface $objectManager
     */
    public function __construct(private readonly ObjectManagerInterface $objectManager)
    {
    }

    /**
     * Return CC type object
     *
     * @return null|CcType
     */
    public function getCcType()
    {
        if (\class_exists(CcType::class)) {
            return $this->objectManager->get(CcType::class);
        }
        return null;
    }
}
