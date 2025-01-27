<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Controller\Checkout;

use Magento\Checkout\Model\Session;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Controller\ResultInterface;
use Magento\Framework\View\Result\Page;
use Magento\Framework\View\Result\PageFactory;
use Magento\Quote\Api\Data\CartInterface;

class Index extends Action
{
    /**
     * @var PageFactory
     */
    protected $pageFactory;

    /**
     * @var Session
     */
    protected $checkoutSession;

    /**
     * Index constructor.
     *
     * @param Context $context
     * @param PageFactory $pageFactory
     * @param Session $checkoutSession
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
     * Controller action function
     *
     * @return ResponseInterface|ResultInterface|Page
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

        // Set the page metadata
        $title = __('Secure Checkout');
        $description = __('Checkout Securely');

        $page->getConfig()->getTitle()->set($title);
        $page->getConfig()->setDescription($description);

        return $page;
    }

    /**
     * Check if quote os valid
     *
     * @param CartInterface $quote
     * @return bool
     */
    public function isQuoteValid(CartInterface $quote): bool
    {
        return $quote->hasItems() && !$quote->getHasError() && $quote->validateMinimumAmount();
    }
}
