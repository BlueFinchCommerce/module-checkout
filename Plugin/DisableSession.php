<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Plugin;

use Magento\Framework\App\Area;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\State;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\Session\SessionStartChecker;

class DisableSession
{
    /**
     * @param RequestInterface $request
     * @param State $appState
     * @param SerializerInterface $serializer
     * @param array $operationNames
     */
    public function __construct(
        private readonly RequestInterface $request,
        private readonly State $appState,
        private readonly SerializerInterface $serializer,
        private readonly array $operationNames
    ) {
    }

    /**
     * Prevents session starting while in graphql area and session is disabled in config.
     *
     * @param SessionStartChecker $subject
     * @param bool $result
     * @return bool
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     * @SuppressWarnings(PHPMD.EmptyCatchBlock)
     */
    public function afterCheck(SessionStartChecker $subject, bool $result): bool
    {
        if (!$result || empty($this->operationNames) || !$this->request->getContent()) {
            return false;
        }
        try {
            if ($this->appState->getAreaCode() === Area::AREA_GRAPHQL && $this->isCheckoutRequest()) {
                $result = false;
            }
        } catch (LocalizedException $e) {} finally { //@codingStandardsIgnoreLine
            return $result;
        }
    }

    /**
     * @return bool
     */
    private function isCheckoutRequest(): bool
    {
        try {
            $requestBody = $this->serializer->unserialize($this->request->getContent());
            $operationName = $requestBody['operationName'] ?? null;
            if ($operationName === null || !in_array($operationName, $this->operationNames)) {
                return false;
            }
            return true;
        } catch (\Throwable $e) {
            // Fail silently.
        }
        return false;
    }
}
