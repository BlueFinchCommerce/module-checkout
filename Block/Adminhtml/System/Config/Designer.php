<?php

namespace BlueFinch\Checkout\Block\Adminhtml\System\Config;

use Magento\Backend\Block\Template\Context;
use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Data\Form\Element\AbstractElement;
use Magento\Framework\View\Helper\SecureHtmlRenderer;
use BlueFinch\Checkout\ViewModel\Assets;

class Designer extends Field
{
    protected $_template = 'BlueFinch_Checkout::system/config/designer.phtml';

    /**
     * @param Context $context
     * @param array $data
     * @param SecureHtmlRenderer|null $secureRenderer
     * @param Assets $assets
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
     * @param AbstractElement $element
     * @return string
     */
    protected function _getElementHtml(AbstractElement $element)
    {
        $this->addData(['asset_view_model' => $this->assets]);
        return $this->_toHtml();
    }
}
