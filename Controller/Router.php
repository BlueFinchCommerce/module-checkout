<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Controller;

use Gene\BetterCheckout\Model\ConfigurationInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\RouterInterface;

/**
 * Class Router
 */
class Router implements RouterInterface
{
    /**
     * @var ConfigurationInterface
     */
    private $configuration;

    /**
     * Router constructor.
     *
     * @param ConfigurationInterface $configuration
     * @return void
     */
    public function __construct (ConfigurationInterface $configuration)
    {
        $this->configuration = $configuration;
    }

    /**
     * @param RequestInterface $request
     *
     * @return \Magento\Framework\App\ActionInterface|void
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
            $request->setModuleName('genebettercheckout')->setControllerName('checkout')->setActionName('index');
        }
    }
}
