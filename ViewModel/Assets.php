<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\ViewModel;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\View\Asset\File;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;

class Assets implements ArgumentInterface
{
    const ASSETS_DEF_FILE = 'manifest.json';
    const ASSETS_BASE_DIR = 'Gene_BetterCheckout::js/checkout/dist/';
    const DESIGNER_VALUES_PATH = 'gene_better_checkout/general/designer_values';
    const CUSTOM_WORDING_VALUES_PATH = 'gene_better_checkout/general/custom_wording';
    const LOGO_PATH = 'gene_better_checkout/general/gene_better_checkout_logo';

    /** @var ScopeConfigInterface  */
    private $scopeConfig;

    /** @var AssetRepository  */
    private $assetRepository;

    /** @var array */
    private $assetFilesByType = [];

    /** @var StoreManagerInterface */
    private $storeManager;

    /**
     * Assets constructor.
     *
     * @param AssetRepository $assetRepository
     * @param ScopeConfigInterface $scopeConfig
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        AssetRepository $assetRepository,
        ScopeConfigInterface $scopeConfig,
        StoreManagerInterface $storeManager,
    ) {
        $this->scopeConfig = $scopeConfig;
        $this->assetRepository = $assetRepository;
        $this->storeManager = $storeManager;
    }

    /**
     * @return array
     * @throws LocalizedException
     */
    public function getAssets($area = 'frontend'): array
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
            foreach($assetDefinitionArray['main.js']['assets'] as $fileName) {
                $this->createAsset($fileName, $area);
            }
        }
        if (array_key_exists('css', $assetDefinitionArray['main.js'])) {
            $this->assetFilesByType['css'] = [$this->createAsset($assetDefinitionArray['main.js']['css'][0], $area)];
        }
        if (array_key_exists('file', $assetDefinitionArray['main.js'])) {
            $this->assetFilesByType['js']['main'] = [$this->createAsset($assetDefinitionArray['main.js']['file'], $area)];
        }
        if (array_key_exists('imports', $assetDefinitionArray['main.js'])) {
            foreach($assetDefinitionArray['main.js']['imports'] as $fileName) {
                $this->assetFilesByType['js']['imports'][] = $this->createAsset($assetDefinitionArray[$fileName]['file'], $area);
            }
        }
        return $this->assetFilesByType;
    }

    /**
     * @param string $type
     * @return File[]
     */
    public function getAssetsByType(string $type, $area = 'frontend'): array
    {
        $assets = $this->getAssets($area);
        return $assets[$type] ?? [];
    }

    /**
     * @param string $fileName
     * @return File
     * @throws LocalizedException
     */
    public function createAsset(string $fileName, $area = 'frontend'): File
    {
        $params = ['area' => $area];
        return $this->assetRepository->createAsset(
            self::ASSETS_BASE_DIR .  $fileName,
            $params
        );
    }

    /**
     * Returns an array of the styles set in the admin designer.
     *
     * @param string $scopeType
     * @param int|string|null $scopeCode
     */
    public function getStyles(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        $scopeCode = null
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
     */
    public function getCustomWording(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        $scopeCode = null
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
     * @param string|null $scopeCode
     */
    public function getLogo(
        string $scopeType = ScopeInterface::SCOPE_STORE,
        $scopeCode = null
    ): string
    {
        $logoValue = $this->scopeConfig->getValue(
            self::LOGO_PATH,
            $scopeType,
            $scopeCode
        );

        if ($logoValue) {
            $imageBaseUrl = $this->storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
            return $imageBaseUrl . 'gene_better_checkout/' . $logoValue;
        }

        return '';
    }
}
