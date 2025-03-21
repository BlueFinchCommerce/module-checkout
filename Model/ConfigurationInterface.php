<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model;

use Magento\Store\Model\ScopeInterface;

interface ConfigurationInterface
{
    /** @var string */
    public const VUE_CHECKOUT_FONT_MEDIA_DIR = 'checkout_font';
    /** @var string */
    public const VUE_CHECKOUT_ENABLED_XML_PATH = 'bluefinch_checkout/general/enabled';
    /** @var string */
    public const VUE_CHECKOUT_ENABLE_DEBUG_XML_PATH = 'bluefinch_checkout/general/enable_debug';
    /** @var string */
    public const VUE_CHECKOUT_ENABLE_VITE_WATCH_MODE = 'bluefinch_checkout/general/enable_local_developer_vite_watch_mode';
    /** @var string */
    public const RECAPTCHA_FRONTEND_SUCCESS_XML_PATH = 'recaptcha_frontend/type_for/customer_create_success';
    /** @var string */
    public const VUE_CHECKOUT_FONT_XML_PATH = 'bluefinch_checkout/general/checkout_designer/font_upload';
    /** @var string */
    public const VUE_CHECKOUT_FONT_CDN_XML_PATH = 'bluefinch_checkout/general/checkout_designer/font_cdn';

    /**
     * Check if extension is enabled
     *
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return bool
     */
    public function getIsEnabled(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): bool;

    /**
     * Return a path for font file
     *
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return string
     */
    public function getFontPath(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): string;

    /**
     * Return font url from CDN
     *
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return string
     */
    public function getFontCdnUrl(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): string;

    /**
     * Retrieve the font family name from the CDN URL
     *
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return string
     */
    public function getFontFamilyFromCdnUrl(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): string;

    /**
     * Is debugging enabled
     *
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return bool
     */
    public function getIsDebugEnabled(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): bool;

    /**
     * Is developer vite watch mode enabled
     *
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return bool
     */
    public function getIsDeveloperViteWatchModeEnabled(string $scopeType = ScopeInterface::SCOPE_STORE, string $scopeCode = null): bool;
}
