<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\ViewModel;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Registry;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\View\Asset\File;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Store\Model\ScopeInterface;

class Assets implements ArgumentInterface
{
    const ASSETS_DEF_FILE = 'manifest.json';
    const ASSETS_BASE_DIR = 'Gene_BetterCheckout::js/checkout/dist/';
    const DESIGNER_VALUES_PATH = 'gene_better_checkout/general/designer_values';

    /** @var Registry  */
    private $registry;

    /** @var ProductRepositoryInterface  */
    private $productRepository;

    /** @var ScopeConfigInterface  */
    private $scopeConfig;

    /** @var AssetRepository  */
    private $assetRepository;

    /** @var array */
    private $assetFilesByType = [];

    /**
     * Assets constructor.
     *
     * @param Registry $registry
     * @param ProductRepositoryInterface $productRepository
     * @param ScopeConfigInterface $scopeConfig
     * @param AssetRepository $assetRepository
     */
    public function __construct(
        Registry $registry,
        ProductRepositoryInterface $productRepository,
        ScopeConfigInterface $scopeConfig,
        AssetRepository $assetRepository
    ) {
        $this->productRepository = $productRepository;
        $this->registry = $registry;
        $this->scopeConfig = $scopeConfig;
        $this->assetRepository = $assetRepository;
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
}
