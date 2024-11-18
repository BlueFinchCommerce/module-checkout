<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\ViewModel;

use Gene\BetterCheckout\Model\ConfigurationInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\ProductMetadataInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\View\Asset\File;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;

class Assets implements ArgumentInterface
{
    /** @var string */
    const ASSETS_DEF_FILE = 'manifest.json';
    /** @var string */
    const ASSETS_BASE_DIR = 'Gene_BetterCheckout::js/checkout/dist/';
    /** @var string */
    const DESIGNER_VALUES_PATH = 'gene_better_checkout/general/checkout_designer/designer_values';
    /** @var string */
    const CUSTOM_WORDING_VALUES_PATH = 'gene_better_checkout/general/checkout_designer/custom_wording';
    /** @var string */
    const LOGO_PATH = 'gene_better_checkout/general/checkout_designer/gene_better_checkout_logo';

    /** @var array */
    private $assetFilesByType = [];

    private ProductMetadataInterface $productMetadata;

    /**
     * @param AssetRepository $assetRepository
     * @param ScopeConfigInterface $scopeConfig
     * @param StoreManagerInterface $storeManager
     * @param ConfigurationInterface $configuration
     * @param UrlInterface $urlInterface
     * @param ProductMetadataInterface $productMetadata
     */
    public function __construct(
        private readonly AssetRepository $assetRepository,
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly StoreManagerInterface $storeManager,
        private readonly ConfigurationInterface $configuration,
        private readonly UrlInterface $urlInterface,
        ProductMetadataInterface $productMetadata
    ) {
        $this->productMetadata = $productMetadata;
    }


    /**
     * Get the Magento Edition (e.g., Community, Enterprise).
     *
     * @return string
     */
    public function getMagentoEdition(): string
    {
        return $this->productMetadata->getEdition();
    }


    /**
     * @return string|null
     * @throws NoSuchEntityException
     */
    public function getFontUrl(): ?string
    {
        $fontPath = $this->configuration->getFontPath();
        if (!$fontPath) {
            return null;
        }

        $mediaUrl = $this->storeManager->getStore()->getBaseUrl(UrlInterface::URL_TYPE_MEDIA);
        return $mediaUrl . ConfigurationInterface::VUE_CHECKOUT_FONT_MEDIA_DIR . '/' . $fontPath;
    }

    /**
     * @return string|null
     */
    public function getFontCdnUrl(): ?string
    {
        return $this->configuration->getFontCdnUrl();
    }

    /**
     * Retrieves the font family name from the CDN URL
     *
     * @return string
     */
    public function getFontFamily(): string
    {
        return $this->configuration->getFontFamilyFromCdnUrl();
    }

    /**
     * @param string $fontUrl
     * @return string
     */
    public function getFontFormat(string $fontUrl): string
    {
        return pathinfo($fontUrl, PATHINFO_EXTENSION);
    }

    /**
     * @param string $area
     * @return array
     * @throws LocalizedException
     */
    public function getAssets(string $area = 'frontend'): array
    {
        if (count($this->assetFilesByType)) {
            return $this->assetFilesByType;
        }
        $assetDefinitionFile = $this->createAsset(self::ASSETS_BASE_DIR . self::ASSETS_DEF_FILE, $area);
        $assetDefinitionContent = $assetDefinitionFile->getContent();
        $assetDefinitionArray = json_decode($assetDefinitionContent, true);
        $this->assetFilesByType = [];
        $this->assetFilesByType['js'] = [];
        if (array_key_exists('assets', $assetDefinitionArray['main.js'])) {
            foreach($assetDefinitionArray['main.js']['assets'] as $fileName) {
                $this->createAsset(self::ASSETS_BASE_DIR . $fileName, $area);
            }
        }
        if (array_key_exists('css', $assetDefinitionArray['main.js'])) {
            $this->assetFilesByType['css'] = [
                $this->createAsset(self::ASSETS_BASE_DIR . $assetDefinitionArray['main.js']['css'][0], $area)
            ];
        }
        if (array_key_exists('file', $assetDefinitionArray['main.js'])) {
            $this->assetFilesByType['js']['main'] = [
                $this->createAsset(self::ASSETS_BASE_DIR . $assetDefinitionArray['main.js']['file'], $area)
            ];
        }
        if (array_key_exists('imports', $assetDefinitionArray['main.js'])) {
            foreach($assetDefinitionArray['main.js']['imports'] as $fileName) {
                $this->assetFilesByType['js']['imports'][] = $this->createAsset(
                    self::ASSETS_BASE_DIR . $assetDefinitionArray[$fileName]['file'], $area
                );
            }
        }
        return $this->assetFilesByType;
    }

    /**
     * @param string $type
     * @param string $area
     * @return File[]
     * @throws LocalizedException
     */
    public function getAssetsByType(string $type, string $area = 'frontend'): array
    {
        $assets = $this->getAssets($area);
        return $assets[$type] ?? [];
    }

    /**
     * @param string $fileName
     * @param string $area
     * @param array $params
     * @return File
     * @throws LocalizedException
     */
    public function createAsset(string $fileName, string $area = 'frontend', array $params = []): File
    {
        $params['area'] = $area;

        $assetDefinitionFile = null;
        if ($this->configuration->getIsDeveloperViteWatchModeEnabled()) {
            try {
                // Try and get the asset from the vite watch directory
                $assetDefinitionFile = $this->assetRepository->createAsset(
                    str_replace('js/checkout/dist/', 'js/checkout/dist-dev/', $fileName),
                    $params
                );
                $assetDefinitionFile->getSourceFile(); // trigger file resolution
            } catch (\Throwable) {
                $assetDefinitionFile = null;
            }
        }
        if (!$assetDefinitionFile) {
            $assetDefinitionFile = $this->assetRepository->createAsset(
                $fileName,
                $params
            );
        }
        return $assetDefinitionFile;
    }

    /**
     * Retrieve url of a view file, with better checkout developer mode handling for the dist directory
     *
     * @see \Magento\Framework\View\Element\AbstractBlock::getViewFileUrl()
     *
     * This method is analogous to the above, however instead of falling back to the following
     * public function getUrlWithParams($fileId, array $params)
     * {
     *    $asset = $this->createAsset($fileId, $params);
     *    return $asset->getUrl();
     * }
     *
     * We can use our own asset handling logic, which will allow us to fall back to dist-dev when appropriate
     *
     * @param string $fileId
     * @param array $params
     * @return string
     */
    public function getDistViewFileUrl($fileId, array $params = [])
    {
        try {
            $params['_secure'] = true;
            $area = $params['area'] ?? 'frontend';
            $asset = $this->createAsset($fileId, $area, $params);
            $url = $asset->getUrl();
            return $url;
        } catch (\Exception $e) {
            return $this->urlInterface->getUrl('', ['_direct' => 'core/index/notFound']);
        }
    }

    /**
     * Returns an array of the styles set in the admin designer.
     *
     * @param string $scopeType
     * @param int|string|null $scopeCode
     * @return string
     */
    public function getStyles(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        mixed $scopeCode = null
    ): string
    {
        $designerValues = $this->scopeConfig->getValue(
            self::DESIGNER_VALUES_PATH,
            $scopeType,
            $scopeCode
        );

        return $designerValues ?? '';
    }

    /**
     * Returns an object containing the customer wording values set in admin designer.
     *
     * @param string $scopeType
     * @param int|string|null $scopeCode
     * @return string
     */
    public function getCustomWording(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        mixed $scopeCode = null
    ): string
    {
        $customWording = $this->scopeConfig->getValue(
            self::CUSTOM_WORDING_VALUES_PATH,
            $scopeType,
            $scopeCode
        );

        return $customWording ?? '';
    }

    /**
     * Returns the media URL for the custom logo is it exists in configuration.
     *
     * @param string $scopeType
     * @param int|string|null $scopeCode
     * @return string
     * @throws NoSuchEntityException
     */
    public function getLogo(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        mixed $scopeCode = null
    ): string
    {
        $logoValue = $this->scopeConfig->getValue(
            self::LOGO_PATH,
            $scopeType,
            $scopeCode
        );

        if ($logoValue) {
            $imageBaseUrl = $this->storeManager->getStore()->getBaseUrl(UrlInterface::URL_TYPE_MEDIA);
            return $imageBaseUrl . 'gene_better_checkout/' . $logoValue;
        }

        return '';
    }
}
