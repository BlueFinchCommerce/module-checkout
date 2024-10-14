<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class Configuration implements ConfigurationInterface
{
    /**
     * Configuration Constructor
     *
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig
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

}
