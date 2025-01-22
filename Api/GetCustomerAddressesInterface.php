<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Api;

interface GetCustomerAddressesInterface
{
    /**
     * @return string
     */
    public function execute(): string;
}
