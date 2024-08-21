<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\ViewModel;

use Gene\BetterCheckout\Model\ConfigurationInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Filesystem\Io\File as IoFile;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\View\Asset\File;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;

class Assets implements ArgumentInterface
{
    /** @var string */
    private const ASSETS_DEF_FILE = 'manifest.json';
    /** @var string */
    private const ASSETS_BASE_DIR = 'Gene_BetterCheckout::js/checkout/dist/';
    /** @var string */
    private const DESIGNER_VALUES_PATH = 'gene_better_checkout/general/checkout_designer/designer_values';
    /** @var string */
    private const CUSTOM_WORDING_VALUES_PATH = 'gene_better_checkout/general/checkout_designer/custom_wording';
    /** @var string */
    private const LOGO_PATH = 'gene_better_checkout/general/checkout_designer/gene_better_checkout_logo';

    /** @var array */
    private $assetFilesByType = [];

    /**
     * @param AssetRepository $assetRepository
     * @param ScopeConfigInterface $scopeConfig
     * @param StoreManagerInterface $storeManager
     * @param ConfigurationInterface $configuration
     * @param IoFile $file
     */
    public function __construct(
        private readonly AssetRepository $assetRepository,
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly StoreManagerInterface $storeManager,
        private readonly ConfigurationInterface $configuration,
        private readonly IoFile $file
    ) {
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
     * Get font formant from font url
     *
     * @param string $fontUrl
     * @return string
     */
    public function getFontFormat(string $fontUrl): string
    {
        return $this->file->getPathInfo($fontUrl)[PATHINFO_EXTENSION];
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
        $params = [
            'area' => $area
        ];
        $assetDefinitionFile = $this->assetRepository->createAsset(
            self::ASSETS_BASE_DIR . self::ASSETS_DEF_FILE,
            $params
        );
        $assetDefinitionContent = $assetDefinitionFile->getContent();
        $assetDefinitionArray = json_decode($assetDefinitionContent, true);
        $this->assetFilesByType = [];
        $this->assetFilesByType['js'] = [];
        if (array_key_exists('assets', $assetDefinitionArray['main.js'])) {
            foreach ($assetDefinitionArray['main.js']['assets'] as $fileName) {
                $this->createAsset($fileName, $area);
            }
        }
        if (array_key_exists('css', $assetDefinitionArray['main.js'])) {
            $this->assetFilesByType['css'] = [
                $this->createAsset($assetDefinitionArray['main.js']['css'][0], $area)
            ];
        }
        if (array_key_exists('file', $assetDefinitionArray['main.js'])) {
            $this->assetFilesByType['js']['main'] = [
                $this->createAsset($assetDefinitionArray['main.js']['file'], $area)
            ];
        }
        if (array_key_exists('imports', $assetDefinitionArray['main.js'])) {
            foreach ($assetDefinitionArray['main.js']['imports'] as $fileName) {
                $this->assetFilesByType['js']['imports'][] = $this->createAsset(
                    $assetDefinitionArray[$fileName]['file'],
                    $area
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
     * @return File
     * @throws LocalizedException
     */
    public function createAsset(string $fileName, string $area = 'frontend'): File
    {
        $params = ['area' => $area];
        return $this->assetRepository->createAsset(
            self::ASSETS_BASE_DIR . $fileName,
            $params
        );
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
            return $imageBaseUrl . 'gene_better_checkout/' . $logoValue;
        }

        return '';
    }
}
