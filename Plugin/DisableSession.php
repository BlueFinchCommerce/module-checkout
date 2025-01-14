<?php

declare(strict_types=1);

namespace Bluefinch\Checkout\Plugin;

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
     * Conditionally set disable_locking=1 for better checkout graphql requests
     *
     * @param ConfigInterface $subject
     * @param int|bool $result
     * @return bool
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     * @SuppressWarnings(PHPMD.EmptyCatchBlock)
     */
    public function afterGetDisableLocking(ConfigInterface $subject, $result)
    {
        if ($result) {
            return $result; // exit early as disable_locking=1 is already set
        }

        if (!$this->requestPrefix || !$this->request->getContent()) {
            // exit early as we don't have defined content to make a decision
            // return whatever the original disable_locking value was
            return $result;
        }

        try {
            if ($this->appState->getAreaCode() === Area::AREA_GRAPHQL && $this->isCheckoutRequest()) {
                $result = true; // ensure disable_locking=1 is set for our BC graphql requests
            }
        } catch (LocalizedException $e) {}

        return $result;
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
