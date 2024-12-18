<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Plugin;

use Cm\RedisSession\Handler\ConfigInterface;
use Magento\Framework\App\Area;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\State;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Serialize\SerializerInterface;

class DisableSession
{
    /**
     * @param RequestInterface $request
     * @param State $appState
     * @param SerializerInterface $serializer
     * @param string $requestPrefix
     */
    public function __construct(
        private readonly RequestInterface $request,
        private readonly State $appState,
        private readonly SerializerInterface $serializer,
        private readonly string $requestPrefix
    ) {
    }

    /**
     * Prevents session starting while in graphql area and session is disabled in config.
     *
     * @param ConfigInterface $subject
     * @param bool $result
     * @return bool
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     * @SuppressWarnings(PHPMD.EmptyCatchBlock)
     */
    public function afterGetDisableLocking(ConfigInterface $subject, bool $result): bool
    {
        if ($result === true || !$this->requestPrefix || !$this->request->getContent()) {
            return false;
        }
        try {
            if ($this->appState->getAreaCode() === Area::AREA_GRAPHQL && $this->isCheckoutRequest()) {
                $result = true;
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
            if ($operationName === null || !str_starts_with($operationName, $this->requestPrefix)) {
                return false;
            }
            return true;
        } catch (\Throwable $e) {
            // Fail silently.
        }
        return false;
    }
}
