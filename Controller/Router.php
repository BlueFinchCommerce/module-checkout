<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Controller;

use BlueFinch\Checkout\Model\ConfigurationInterface;
use Magento\Framework\App\ActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\RouterInterface;

class Router implements RouterInterface
{
    /**
     * Router constructor.
     *
     * @param ConfigurationInterface $configuration
     */
    public function __construct(
        private readonly ConfigurationInterface $configuration
    ) {
    }

    /**
     * Match the router to request
     *
     * @param RequestInterface $request
     * @return ActionInterface|void
     */
    public function match(RequestInterface $request)
    {
        // Check the checkout is enabled
        if ($this->configuration->getIsEnabled() === false) {
            return;
        }

        // Remove Params
        $identifier = strtok($request->getPathInfo(), '?');

        if ($identifier === false) {
            return;
        }

        // Remove trailing slash
        $identifier = trim($identifier, '/');

        // If the path is checkout then we set the new controller
        if ($identifier === 'checkout' || $identifier === 'checkout/index') {
            $request->setModuleName('bluefinchcheckout')->setControllerName('checkout')->setActionName('index');
        }
    }
}
