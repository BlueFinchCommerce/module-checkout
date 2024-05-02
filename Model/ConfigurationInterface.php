<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Magento\Store\Model\ScopeInterface;

interface ConfigurationInterface
{
    /** @var string */
    const VUE_CHECKOUT_FONT_MEDIA_DIR = 'checkout_font';

    /** @var string */
    const VUE_CHECKOUT_ENABLED_XML_PATH = 'gene_better_checkout/general/enabled';
    /** @var string */
    const VUE_CHECKOUT_FONT_XML_PATH = 'gene_better_checkout/general/checkout_designer/font_upload';

    /**
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return bool
     */
    public function getIsEnabled(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): bool;

    /**
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return string
     */
    public function getFontPath(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): string;
}
