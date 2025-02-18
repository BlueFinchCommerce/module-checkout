<?php
declare(strict_types=1);

namespace BlueFinch\Checkout\ViewModel;

use BlueFinch\Checkout\Model\ConfigurationInterface;
use Magento\Framework\App\Area;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\ProductMetadataInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Filesystem\Io\File as IoFile;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\View\Asset\File;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\App\State;

class Assets implements ArgumentInterface
{
    /** @var string */
    private const ASSETS_DEF_FILE = 'manifest.json';
    /** @var string */
    private const ASSETS_BASE_DIR = 'BlueFinch_Checkout::js/checkout/dist/';
    /** @var string */
    private const DESIGNER_VALUES_PATH = 'bluefinch_checkout/general/checkout_designer/designer_values';
    /** @var string */
    private const CUSTOM_WORDING_VALUES_PATH = 'bluefinch_checkout/general/checkout_designer/custom_wording';
    /** @var string */
    private const LOGO_PATH = 'bluefinch_checkout/general/checkout_designer/bluefinch_checkout_logo';

    /** @var array */
    private $assetFilesByType = [];

    /**
     * @var ProductMetadataInterface
     */
    private ProductMetadataInterface $productMetadata;

    /**
     * @param AssetRepository $assetRepository
     * @param ScopeConfigInterface $scopeConfig
     * @param StoreManagerInterface $storeManager
     * @param ConfigurationInterface $configuration
     * @param IoFile $file
     * @param UrlInterface $urlInterface
     * @param RequestInterface $request
     * @param State $state
     * @param ProductMetadataInterface $productMetadata
     */
    public function __construct(
        private readonly AssetRepository $assetRepository,
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly StoreManagerInterface $storeManager,
        private readonly ConfigurationInterface $configuration,
        private readonly IoFile $file,
        private readonly UrlInterface $urlInterface,
        private readonly RequestInterface $request,
        private readonly State $state,
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
     * Get font url path
     *
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
     * Return font CDN URL
     *
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
     * Get font formant from font url
     *
     * @param string $fontUrl
     * @return string
     */
    public function getFontFormat(string $fontUrl): string
    {
        return $this->file->getPathInfo($fontUrl)['extension'] ?? '';
    }

    /**
     * Get an array of the assets
     *
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
            foreach ($assetDefinitionArray['main.js']['assets'] as $fileName) {
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
            foreach ($assetDefinitionArray['main.js']['imports'] as $fileName) {
                $this->assetFilesByType['js']['imports'][] = $this->createAsset(
                    self::ASSETS_BASE_DIR . $assetDefinitionArray[$fileName]['file'], $area
                );
            }
        }
        return $this->assetFilesByType;
    }

    /**
     * Get an array of the assets by type
     *
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
     * Create new asset
     *
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
     * Retrieve url of a view file, with checkout developer mode handling for the dist directory
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
    ): string {
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
    ): string {
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
    ): string {
        $logoValue = $this->scopeConfig->getValue(
            self::LOGO_PATH,
            $scopeType,
            $scopeCode
        );

        if ($logoValue) {
            $imageBaseUrl = $this->storeManager->getStore()->getBaseUrl(UrlInterface::URL_TYPE_MEDIA);
            return $imageBaseUrl . 'bluefinch_checkout/' . $logoValue;
        }

        return '';
    }

    /**
     * @return array
     * @throws LocalizedException
     */
    public function getAdminScope(): array
    {
        $scope = [
            'store_id' => null,
            'website_id' => null
        ];
        if ($this->state->getAreaCode() == Area::AREA_ADMINHTML) {
            /** @var RequestInterface $request */
            if ($this->request->getParam('store') !== null) {
                $scope['store_id'] = (int)$this->request->getParam('store', 0);
            } elseif ($this->request->getParam('website') !== null) {
                $scope['website_id'] = (int)$this->request->getParam('website', 0);
            }
        }
        return $scope;
    }
}
