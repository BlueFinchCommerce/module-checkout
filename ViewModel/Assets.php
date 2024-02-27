<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\ViewModel;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\Registry;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Framework\View\Asset\Repository as AssetRepository;

class Assets implements ArgumentInterface
{
    const ASSETS_DEF_FILE = 'manifest.json';
    const ASSETS_BASE_DIR = 'Gene_BetterCheckout::js/checkout/dist/';

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
    public function getAssets(): array
    {
        if (count($this->assetFilesByType)) {
            return $this->assetFilesByType;
        }
        $params = [
            'area' => 'frontend'
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
                $this->createAsset($fileName);
            }
        }
        if (array_key_exists('css', $assetDefinitionArray['main.js'])) {
            $this->assetFilesByType['css'] = [$this->createAsset($assetDefinitionArray['main.js']['css'][0])];
        }
        if (array_key_exists('file', $assetDefinitionArray['main.js'])) {
            $this->assetFilesByType['js']['main'] = [$this->createAsset($assetDefinitionArray['main.js']['file'])];
        }
        if (array_key_exists('imports', $assetDefinitionArray['main.js'])) {
            foreach($assetDefinitionArray['main.js']['imports'] as $fileName) {
                $this->assetFilesByType['js']['imports'][] = $this->createAsset($assetDefinitionArray[$fileName]['file']);
            }
        }
        return $this->assetFilesByType;
    }

    /**
     * @param string $type
     *
     * @return \Magento\Framework\View\Asset\File[]|array
     */
    public function getAssetsByType(string $type)
    {
        $assets = $this->getAssets();
        return $assets[$type] ?? [];
    }

    public function createAsset($fileName) {
        $params = [
            'area' => 'frontend'
        ];

        return $this->assetRepository->createAsset(
            self::ASSETS_BASE_DIR .  $fileName,
            $params
        );
    }
}
