<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class Configuration implements ConfigurationInterface
{
    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * Configuration Constructor
     *
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig
    ) {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Return whether debug mode is enabled from config
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
}
