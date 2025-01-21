<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\ViewModel;

use Magento\Framework\App\ProductMetadataInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\Filesystem\Driver\File as FileDriver;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Translation\Model\Js;

class Translations implements ArgumentInterface
{
    /**
     * @param AssetRepository $assetRepository
     * @param FileDriver $driverFile
     * @param DirectoryList $directoryList
     * @param ProductMetadataInterface $productMetadata
     */
    public function __construct(
        private readonly AssetRepository $assetRepository,
        private readonly FileDriver $driverFile,
        private readonly DirectoryList $directoryList,
    ) {
    }

    public function getTranslations(): string
    {
        return $this->driverFile->fileGetContents($this->getTranslationFileFullPath());
    }

    /**
     * Retrieve full path for translation file.
     *
     * @return string
     */
    protected function getTranslationFileFullPath()
    {
        return $this->directoryList->getPath(DirectoryList::STATIC_VIEW) .
            \DIRECTORY_SEPARATOR .
            $this->assetRepository->getStaticViewFileContext()->getPath() .
            \DIRECTORY_SEPARATOR .
            Js\Config::DICTIONARY_FILE_NAME;
    }
}
