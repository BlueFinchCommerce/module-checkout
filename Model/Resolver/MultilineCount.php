<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model\Resolver;

use Magento\Eav\Api\AttributeRepositoryInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

class MultilineCount implements ResolverInterface
{
    /**
     * @param AttributeRepositoryInterface $attributeRepository
     */
    public function __construct(
        private readonly AttributeRepositoryInterface $attributeRepository
    ) {
    }

    /**
     * @inheritDoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, ?array $value = null, ?array $args = null)
    {
        try {
            $entityType = $this->getEntityType($value);
            $attributeCode = $this->getAttributeCode($value);
            $attribute = $this->attributeRepository->get($entityType, $attributeCode);
        } catch (NoSuchEntityException $exception) {
            return 0;
        }

        return (int) $attribute->getMultilineCount() ?? 0;
    }

    /**
     * Return an entity type of the value
     *
     * @param array $value
     * @return string
     * @throws LocalizedException
     */
    private function getEntityType(array $value): string
    {
        if (!isset($value['entity_type'])) {
            throw new LocalizedException(__('"Entity type should be specified'));
        }

        return $value['entity_type'];
    }

    /**
     * Get attribute code
     *
     * @param array $value
     * @return string
     * @throws LocalizedException
     */
    private function getAttributeCode(array $value): string
    {
        if (!isset($value['attribute_code'])) {
            throw new LocalizedException(__('"Attribute code should be specified'));
        }

        return $value['attribute_code'];
    }
}
