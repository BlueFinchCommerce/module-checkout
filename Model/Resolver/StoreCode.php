<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\StoreManagerInterface;

class StoreCode implements ResolverInterface
{
    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManagerInterface;

    /**
     * @param \Magento\Store\Model\StoreManagerInterface $storeManagerInterface
     */
    public function __construct(
        StoreManagerInterface $storeManagerInterface
    ) {
        $this->storeManagerInterface = $storeManagerInterface;
    }

    /**
     * @inheritdoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {
        if (!isset($args['store_id'])) {
            throw new GraphQlInputException(__('Store ID not set'));
        }

        try {
            $store = $this->storeManagerInterface->getStore($args['store_id']);
            $storeCode = (string)$store->getCode();
        } catch (GraphQlNoSuchEntityException $exception) {
            throw new GraphQlNoSuchEntityException($exception->getMessage());
        }

        return [
            'store_code' => $storeCode
        ];
    }
}
