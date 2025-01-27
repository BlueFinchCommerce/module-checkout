<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Api;

interface GetCustomerAddressesInterface
{
    /**
     * Return a json with customer addresses
     *
     * @return string
     */
    public function execute(): string;
}
