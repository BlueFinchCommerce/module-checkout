<?php

namespace Gene\BetterCheckout\Block\Adminhtml\System\Config;

use Magento\Backend\Block\Template\Context;
use Magento\Framework\View\Helper\SecureHtmlRenderer;
use Gene\BetterCheckout\ViewModel\Assets;


class Designer extends \Magento\Config\Block\System\Config\Form\Field
{
    protected $_template = 'Gene_BetterCheckout::system/config/designer.phtml';

    /**
     * @var SecureHtmlRenderer
     */
    private $secureRenderer;

    /**
     * @var Assets
     */
    private $assets;

    /**
     * @param Context $context
     * @param array $data
     * @param SecureHtmlRenderer|null $secureRenderer
     * @param Assets $assets
     */
    public function __construct(
        Context $context,
        Assets $assets,
        array $data = [],
        ?SecureHtmlRenderer $secureRenderer = null
    ) {
        parent::__construct($context, $data, $secureRenderer);
        $this->assets = $assets;
    }

    /**
     * Remove scope label
     *
     * @param  \Magento\Framework\Data\Form\Element\AbstractElement $element
     * @return string
     */
    public function render(\Magento\Framework\Data\Form\Element\AbstractElement $element)
    {
        $element->unsScope()->unsCanUseWebsiteValue()->unsCanUseDefaultValue();
        return parent::render($element);
    }

    protected function _getElementHtml(\Magento\Framework\Data\Form\Element\AbstractElement $element)
    {
        $this->addData(
            [
                'asset_view_model' => $this->assets
            ]
        );

        return $this->_toHtml();
    }
}
