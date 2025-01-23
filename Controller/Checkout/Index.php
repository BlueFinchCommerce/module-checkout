<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Controller\Checkout;

use Magento\Checkout\Model\Session;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\View\Result\PageFactory;
use Magento\Quote\Api\Data\CartInterface;

/**
 * Class Index
 */
class Index extends Action
{
    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $pageFactory;

    /**
     * @var \Magento\Checkout\Model\Session
     */
    protected $checkoutSession;

    /**
     * Index constructor.
     *
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Magento\Framework\View\Result\PageFactory $pageFactory
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @return void
     */
    public function __construct(
        Context $context,
        PageFactory $pageFactory,
        Session $checkoutSession
    ) {
        $this->pageFactory = $pageFactory;
        $this->checkoutSession = $checkoutSession;
        parent::__construct($context);
    }

    /**
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\ResultInterface|\Magento\Framework\View\Result\Page
     */
    public function execute()
    {
        $quote = $this->checkoutSession->getQuote();
        if (!$quote instanceof CartInterface || !$this->isQuoteValid($quote)) {
            return $this->resultRedirectFactory->create()->setPath('checkout/cart');
        }

        $page = $this->pageFactory->create(false, [
            'template' => 'BlueFinch_Checkout::root.phtml',
        ]);

        // Set the page meta data
        $title = __('Secure Checkout');
        $description = __('Checkout Securely');

        $page->getConfig()->getTitle()->set($title);
        $page->getConfig()->setDescription($description);

        return $page;
    }

    /**
     * @param CartInterface $quote
     * @return bool
     */
    public function isQuoteValid(CartInterface $quote): bool
    {
        return $quote->hasItems() && !$quote->getHasError() && $quote->validateMinimumAmount();
    }
}
