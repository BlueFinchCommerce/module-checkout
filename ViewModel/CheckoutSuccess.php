<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\ViewModel;

use Magento\Catalog\Helper\Image;
use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Customer\Model\AccountManagement;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Sales\Block\Order\Info;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\Order\Address;
use Magento\Sales\Model\Order\Item;
use Magento\Sales\Api\OrderCustomerDelegateInterface;
use Magento\Store\Model\Store;
use Magento\Tax\Model\Config;

class CheckoutSuccess implements ArgumentInterface
{

  /**
   * @var CheckoutSession
   */
  private $checkoutSession;

  /**
   * @var Info
   */
  private $orderInfoBlock;

  /**
   * @var Image
   */
  private $imageHelper;

  /**
   * @var OrderCustomerDelegateInterface
   */
  private $delegateService;

  /**
   * @var ScopeConfigInterface
   */
  private $scopeConfig;

  /**
   * @param CheckoutSession $checkoutSession
   * @param Image $imageHelper
   * @param Info $orderInfoBlock
   * @param OrderCustomerDelegateInterface $customerDelegation
   * @param ScopeConfigInterface $scopeConfig
   */
  public function __construct(
    CheckoutSession $checkoutSession,
    Image $imageHelper,
    Info $orderInfoBlock,
    OrderCustomerDelegateInterface $customerDelegation,
    ScopeConfigInterface $scopeConfig
  ) {
    $this->checkoutSession = $checkoutSession;
    $this->imageHelper = $imageHelper;
    $this->orderInfoBlock = $orderInfoBlock;
    $this->delegateService = $customerDelegation;
    $this->scopeConfig = $scopeConfig;
  }

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
  public function getOrderItemProductImageUrl(
    Item $orderItem,
    string $imageType = 'customer_sales_order_grid'
  ): ?string {
    $product = $orderItem->getProduct();
    $productImageUrl = null;
    if ($product) {
      $productImageUrl = $this->imageHelper->init(
        $product,
        $imageType
      )->getUrl();
    }
    return $productImageUrl;
  }

  /**
   * Returns string with formatted address
   *
   * @param Address $address
   * @return null|string
   */
  public function getFormattedAddress(Address $address)
  {
    return $this->orderInfoBlock->getFormattedAddress($address);
  }

  /**
   * Get minimum password length
   *
   * @return string
   */
  public function getMinimumPasswordLength(): string
  {
    return $this->scopeConfig->getValue(AccountManagement::XML_PATH_MINIMUM_PASSWORD_LENGTH);
  }

  /**
   * Get number of password required character classes
   *
   * @return string
   */
  public function getRequiredCharacterClassesNumber(): string
  {
    return $this->scopeConfig->getValue(AccountManagement::XML_PATH_REQUIRED_CHARACTER_CLASSES_NUMBER);
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
    public function displayCartPricesInclTax($store = null)
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
    public function displayCartPricesExclTax($store = null)
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
    public function displayShippingPricesInclTax($store = null)
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
    public function displayShippingPricesExclTax($store = null)
    {
        return $this->scopeConfig->getValue(
                Config::XML_PATH_DISPLAY_CART_SHIPPING,
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                $store
            ) == Config::DISPLAY_TYPE_EXCLUDING_TAX;
    }

}
