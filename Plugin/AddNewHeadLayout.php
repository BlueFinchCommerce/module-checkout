<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\Plugin;

use Magento\Framework\Escaper;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Filesystem\Io\File;
use Magento\Framework\Stdlib\StringUtils;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Asset\AssetInterface;
use Magento\Framework\View\Asset\GroupedCollection;
use Magento\Framework\View\Asset\MergeService;
use Magento\Framework\View\Asset\PropertyGroup;
use Magento\Framework\View\Element\BlockInterface;
use Magento\Framework\View\Element\Template\Context;
use Magento\Framework\View\LayoutInterface;
use Magento\Framework\View\Page\Config;
use Magento\Framework\View\Page\Config\Renderer;
use Psr\Log\LoggerInterface;

class AddNewHeadLayout extends Renderer
{
    /**
     * Array of allowed css files
     *
     * @var array
     */
    protected array $allowedCssFiles = ['checkout.css', 'checkout.min.css'];

    /**
     * @var LayoutInterface
     */
    protected LayoutInterface $layout;

    /**
     * @var File
     */
    protected File $filesystem;

    /**
     * @param Config $pageConfig
     * @param MergeService $assetMergeService
     * @param UrlInterface $urlBuilder
     * @param Escaper $escaper
     * @param StringUtils $string
     * @param LoggerInterface $logger
     * @param Context $context
     * @param File $filesystem
     */
    public function __construct(
        Config $pageConfig,
        MergeService $assetMergeService,
        UrlInterface $urlBuilder,
        Escaper $escaper,
        StringUtils $string,
        LoggerInterface $logger,
        Context $context,
        File $filesystem
    ) {
        parent::__construct(
            $pageConfig,
            $assetMergeService,
            $urlBuilder,
            $escaper,
            $string,
            $logger
        );
        $this->layout = $context->getLayout();
        $this->filesystem = $filesystem;
    }

    /**
     * If the layout block 'checkout.head.additional' exists replace the normal head content
     *
     * @param Renderer $subject
     * @param string $result
     * @return bool|BlockInterface|string
     */
    public function afterRenderHeadContent(Renderer $subject, $result)
    {
        if ($blockInstance = $this->layout->getBlock('checkout.head.additional')) {
            // If the block exists we reset the head content
            $result = $this->renderMetadata();
            $result .= $this->renderTitle();
            $this->prepareFavicon();
            $result .= $this->renderAssets($this->getAvailableResultGroups());
            $result .= $this->getCheckoutAssets();
            $result .= $blockInstance->toHtml();
        }

        return $result;
    }

    /**
     * Get checkout css and ICO files (favicons)
     *
     * @return string
     */
    public function getCheckoutAssets()
    {
        $result = '';

        /** @var $group PropertyGroup */
        foreach ($this->pageConfig->getAssetCollection()->getGroups() as $group) {
            $type = $group->getProperty(GroupedCollection::PROPERTY_CONTENT_TYPE);

            if ($type == 'css' || $type == 'ico') {
                $assets = $this->processMerge($group->getAll(), $group);
                $attributes = $this->getGroupAttributes($group);

                try {
                    /** @var $asset AssetInterface */
                    foreach ($assets as $asset) {
                        // Only render the file if its in the allowed types
                        if ($this->canRenderCss($asset->getUrl()) || $type == 'ico') {
                            $template = $this->getAssetTemplate(
                                $group->getProperty(GroupedCollection::PROPERTY_CONTENT_TYPE),
                                $this->addDefaultAttributes($this->getAssetContentType($asset), $attributes)
                            );

                            $result .= sprintf($template, $asset->getUrl());
                        }
                    }
                } catch (LocalizedException $e) {
                    $this->logger->critical($e);
                    $result .= sprintf($template, $this->urlBuilder->getUrl('', ['_direct' => 'core/index/notFound']));
                }
            }
        }
        return $result;
    }

    /**
     * Check if can render CSS
     *
     * @param string $url
     * @return bool|int
     */
    public function canRenderCss($url)
    {
        $path = $this->filesystem->getPathInfo($url)[PATHINFO_BASENAME] ?? null;
        return in_array($path, $this->allowedCssFiles);
    }
}
