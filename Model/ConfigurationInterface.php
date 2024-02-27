<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Magento\Store\Model\ScopeInterface;

interface ConfigurationInterface
{
    /**
     * Constants with xml paths for the configurations
     */
    const VUE_CHECKOUT_ENABLED_XML_PATH = 'gene_better_checkout/general/enabled';

    /**
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return bool
     */
    public function getIsEnabled(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        string $scopeCode = null
    ): bool;
}
