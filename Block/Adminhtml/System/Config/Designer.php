<?php

namespace Gene\BetterCheckout\Block\Adminhtml\System\Config;

use Magento\Backend\Block\Template\Context;
use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Data\Form\Element\AbstractElement;
use Magento\Framework\View\Helper\SecureHtmlRenderer;
use Gene\BetterCheckout\ViewModel\Assets;

class Designer extends Field
{
    /**
     * Template file variable
     *
     * @var string
     */
    protected string $_template = 'Gene_BetterCheckout::system/config/designer.phtml';

    /**
     * @param Assets $assets
     * @param Context $context
     * @param array $data
     * @param SecureHtmlRenderer|null $secureRenderer
     */
    public function __construct(
        private readonly Assets $assets,
        Context $context,
        array $data = [],
        ?SecureHtmlRenderer $secureRenderer = null
    ) {
        parent::__construct($context, $data, $secureRenderer);
    }

    /**
     * Remove scope label
     *
     * @param  AbstractElement $element
     * @return string
     */
    public function render(AbstractElement $element)
    {
        $element->unsScope()->unsCanUseWebsiteValue()->unsCanUseDefaultValue();
        return parent::render($element);
    }

    /**
     * Add view_model to assets
     *
     * @param AbstractElement $element
     * @return string
     */
    protected function _getElementHtml(AbstractElement $element)
    {
        $this->addData(['asset_view_model' => $this->assets]);
        return $this->_toHtml();
    }
}
