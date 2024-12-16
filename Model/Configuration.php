<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use Gene\BetterCheckout\Factory\Paypal\Braintree\Helper\CcTypeFactory;

class Configuration implements ConfigurationInterface
{
    /**
     * Configuration Constructor
     *
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly CcTypeFactory $ccTypeFactory
    ) {
    }

    /**
     * Return whether checkout is enabled from config
     *
     * @param string $scopeType
     * @param null $scopeCode
     * @return bool
     */
    public function getIsEnabled(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        $scopeCode = null
    ): bool {
        return (bool) $this->scopeConfig->getValue(
            self::VUE_CHECKOUT_ENABLED_XML_PATH,
            $scopeType,
            $scopeCode
        );
    }

    /**
     * @inheritDoc
     */
    public function getFontPath(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): string
    {
        return $this->scopeConfig->getValue(
            self::VUE_CHECKOUT_FONT_XML_PATH,
            $scopeType,
            $scopeCode
        ) ?? '';
    }

    /**
     * @inheritDoc
     */
    public function getFontCdnUrl(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): string
    {
        return $this->scopeConfig->getValue(
                self::VUE_CHECKOUT_FONT_CDN_XML_PATH,
                $scopeType,
                $scopeCode
            ) ?? '';
    }

    /**
    * Retrieve the font family name from the CDN URL
    *
    * @param string $scopeType
    * @param string|null $scopeCode
    * @return string
    */
    public function getFontFamilyFromCdnUrl(
    string $scopeType = ScopeInterface::SCOPE_STORE,
    string $scopeCode = null
    ): string {
        $fontCdnUrl = $this->getFontCdnUrl($scopeType, $scopeCode);
        $defaultFontFamily = 'Montserrat';

        // Extract font family from the CDN URL
        if ($fontCdnUrl) {
            $urlParts = parse_url($fontCdnUrl);
            if (isset($urlParts['query'])) {
                parse_str($urlParts['query'], $queryParams);
                if (isset($queryParams['family'])) {
                    return str_replace('+', ' ', $queryParams['family']); // Replace '+' with space for CSS compatibility
                }
            }
        }
        return $defaultFontFamily;
    }

    /**
     * Return whether debug mode is enabled from config
     *
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return bool
     */
    public function getIsDebugEnabled(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        $scopeCode = null
    ): bool {
        return (bool) $this->scopeConfig->getValue(
            self::VUE_CHECKOUT_ENABLE_DEBUG_XML_PATH,
            $scopeType,
            $scopeCode
        );
    }

    /**
     * Return whether vite watch mode is enabled
     *
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return bool
     */
    public function getIsDeveloperViteWatchModeEnabled(
        string $scopeType = ScopeInterface::SCOPE_STORE,
               $scopeCode = null
    ): bool {
        return (bool) $this->scopeConfig->getValue(
            self::VUE_CHECKOUT_ENABLE_VITE_WATCH_MODE,
            $scopeType,
            $scopeCode
        );
    }

    /**
     * @return array
     */
    public function getPaypalCcTypes()
    {
        $ccTypes = [];

        // Support MageOS which doesn't bundle with PayPal\Braintree
        $ccTypeHelper = $this->ccTypeFactory->getCcType();
        if ($ccTypeHelper !== null) {
            $ccTypesTmp = $ccTypeHelper->getCcTypes();
            if (is_array($ccTypesTmp)) {
                $ccTypes = $ccTypesTmp;
            }
        }

        return $ccTypes;
    }
}
