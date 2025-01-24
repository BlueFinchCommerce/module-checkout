<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\ViewModel;

use Magento\Catalog\Model\Product\ImageFactory;
use Magento\Catalog\Model\View\Asset\PlaceholderFactory;
use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Customer\Model\AccountManagement;
use Magento\Framework\App\Area;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Framework\View\DesignInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Sales\Block\Order\Info;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\Order\Address;
use Magento\Sales\Model\Order\Item;
use Magento\Sales\Api\OrderCustomerDelegateInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\Store;
use Magento\Tax\Model\Config;
use BlueFinch\Checkout\Model\ConfigurationInterface;

class CheckoutSuccess implements ArgumentInterface
{
    /** @var string[] */
    private $placeholderCache = [];

    /**
     * @param CheckoutSession $checkoutSession
     * @param Info $orderInfoBlock
     * @param OrderCustomerDelegateInterface $delegateService
     * @param ScopeConfigInterface $scopeConfig
     * @param PlaceholderFactory $placeholderFactory
     * @param AssetRepository $assetRepository
     * @param DesignInterface $themeDesign
     * @param ImageFactory $productImageFactory
     */
    public function __construct(
        private readonly CheckoutSession $checkoutSession,
        private readonly Info $orderInfoBlock,
        private readonly OrderCustomerDelegateInterface $delegateService,
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly PlaceholderFactory $placeholderFactory,
        private readonly AssetRepository $assetRepository,
        private readonly DesignInterface $themeDesign,
        private readonly ImageFactory $productImageFactory,
    ) {}

    /**
     * @return Order
     */
    public function getLastOrder(): Order
    {
        return $this->checkoutSession->getLastRealOrder();
    }

    /**
     * Delegate order for new customer
     *
     * @return void
     */
    public function assignOrderToNewCustomer(): void
    {
        $this->delegateService->delegateNew((int)$this->getLastOrder()->getId());
    }

    /**
     * Return Product Image URL for Order Item
     *
     * @param Item $orderItem
     * @param string $imageType
     * @return string|null
     */
    public function getOrderItemProductImageUrl(Item $orderItem, string $imageType = 'thumbnail'): ?string
    {
        $product = $orderItem->getProduct();
        $imagePath = $product->getData($imageType);
        try {
            if (empty($imagePath) && !empty($this->placeholderCache[$imageType])) {
                return $this->placeholderCache[$imageType];
            }
            $image = $this->productImageFactory->create();
            $image->setDestinationSubdir($imageType)
                ->setBaseFile($imagePath);

            if ($image->isBaseFilePlaceholder()) {
                $this->placeholderCache[$imageType] = $this->getPlaceholder($imageType);
                return $this->placeholderCache[$imageType];
            }
        } catch (\Exception $exception) {
            return null;
        }

        return $image->getUrl();
    }

    /**
     * Returns string with formatted address
     *
     * @param Address $address
     * @return null|string
     */
    public function getFormattedAddress(Address $address): ?string
    {
        return $this->orderInfoBlock->getFormattedAddress($address);
    }

    /**
     * Get minimum password length
     *
     * @return int
     */
    public function getMinimumPasswordLength(): int
    {
        return (int) $this->scopeConfig->getValue(AccountManagement::XML_PATH_MINIMUM_PASSWORD_LENGTH);
    }

    /**
     * Get number of password required character classes
     *
     * @return int
     */
    public function getRequiredCharacterClassesNumber(): int
    {
        return (int) $this->scopeConfig->getValue(AccountManagement::XML_PATH_REQUIRED_CHARACTER_CLASSES_NUMBER);
    }

    /**
     * Get number of password required character classes
     *
     * @return string
     */

    /**
     * Return the flag for display sales for cart prices including tax
     *
     * @param null|string|bool|int|Store $store
     * @return bool
     */
    public function displayCartPricesInclTax(mixed $store = null): bool
    {
        return $this->scopeConfig->getValue(
                Config::XML_PATH_DISPLAY_CART_PRICE,
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                $store
            ) == Config::DISPLAY_TYPE_INCLUDING_TAX;
    }

    /**
     * Return the flag for display sales for cart prices excluding tax
     *
     * @param null|string|bool|int|Store $store
     * @return bool
     */
    public function displayCartPricesExclTax(mixed $store = null): bool
    {
        return $this->scopeConfig->getValue(
                Config::XML_PATH_DISPLAY_CART_PRICE,
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                $store
            ) == Config::DISPLAY_TYPE_EXCLUDING_TAX;
    }

    /**
     * Return the flag for display sales for shipping prices including tax
     *
     * @param null|string|bool|int|Store $store
     * @return bool
     */
    public function displayShippingPricesInclTax(mixed $store = null)
    {
        return $this->scopeConfig->getValue(
                Config::XML_PATH_DISPLAY_CART_SHIPPING,
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                $store
            ) == Config::DISPLAY_TYPE_INCLUDING_TAX;
    }

    /**
     * Return the flag for display sales for shipping prices excluding tax
     *
     * @param null|string|bool|int|Store $store
     * @return bool
     */
    public function displayShippingPricesExclTax(mixed $store = null)
    {
        return $this->scopeConfig->getValue(
                Config::XML_PATH_DISPLAY_CART_SHIPPING,
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                $store
            ) == Config::DISPLAY_TYPE_EXCLUDING_TAX;
    }

    /**
     * @param string $scopeType
     * @param string|null $scopeCode
     * @return string
     */
    public function getRecaptchaSuccessEnabled(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        string $scopeCode = null
    ): string
    {
        return $this->scopeConfig->getValue(
            ConfigurationInterface::RECAPTCHA_FRONTEND_SUCCESS_XML_PATH,
            $scopeType,
            $scopeCode
        ) ?? '';
    }

    /**
     * @param string $imageType
     * @return string
     */
    private function getPlaceholder(string $imageType): string
    {
        $imageAsset = $this->placeholderFactory->create(['type' => $imageType]);

        // check if placeholder defined in config
        if ($imageAsset->getFilePath()) {
            return $imageAsset->getUrl();
        }

        $params = [
            'area' => Area::AREA_FRONTEND,
            'themeId' => $this->themeDesign->getConfigurationDesignTheme(Area::AREA_FRONTEND),
        ];

        return $this->assetRepository->getUrlWithParams(
            "Magento_Catalog::images/product/placeholder/{$imageType}.jpg",
            $params
        );
    }
}
