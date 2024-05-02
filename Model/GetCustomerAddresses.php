<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Exception;
use Gene\BetterCheckout\Api\GetCustomerAddressesInterface;
use Magento\Customer\Model\Session;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Serialize\SerializerInterface;

class GetCustomerAddresses implements GetCustomerAddressesInterface
{
    /**
     * @param Session $session
     * @param SerializerInterface $serializer
     * @param ManagerInterface $eventManager
     */
    public function __construct(
        private readonly Session $session,
        private readonly SerializerInterface $serializer,
        private readonly ManagerInterface $eventManager
    ) {
    }

    /**
     * @return string
     */
    public function execute(): string {
        try {
            $customer = $this->session->getCustomer();
            $resultAddresses = [];
            foreach ($customer->getAddresses() as $address) {
                $resultAddresses[] = $this->formatAddressData($address);
            }
            $this->eventManager->dispatch(
                'customer_addresses_before_return',
                ['return_data' => $resultAddresses, 'customer' => $customer]
            );
            return $this->serializer->serialize([
                'error' => 0,
                'result' => $resultAddresses
            ]);
        } catch (Exception $exception) {
            return $this->serializer->serialize([
                'error' => 1,
                'result' => $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $address
     * @return array
     */
    protected function formatAddressData($address): array
    {
        return [
            'firstname' => $address->getFirstname(),
            'lastname' => $address->getLastname(),
            'middlename' => $address->getMiddlename(),
            'postcode' => $address->getPostcode(),
            'prefix' => $address->getPrefix(),
            'suffix' => $address->getSuffix(),
            'street' => $address->getStreet(),
            'country_code' => $address->getCountryId(),
            'city' => $address->getCity(),
            'company' => $address->getCompany(),
            'fax' => $address->getFax(),
            'telephone' => $address->getTelephone(),
            'vat_id' => $address->getVatId(),
            'region_id' => $address->getRegionId(),
            'region' => $address->getRegion()
        ];
    }
}
