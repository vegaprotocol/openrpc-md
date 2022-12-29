---
    title: OpenRPC Wallet API
---
- [client.connect_wallet](#clientconnect_wallet): Initiates a connection between a wallet and a third-party application.
- [client.disconnect_wallet](#clientdisconnect_wallet): Ends the connection between the third-party application and the wallet.
- [client.get_permissions](#clientget_permissions): Returns the permissions set on the wallet for the third-party application.
- [client.request_permissions](#clientrequest_permissions): Requests permissions update for the third-party application.
- [client.list_keys](#clientlist_keys): Returns the keys the user has allowed the third-party application to have access to.
- [client.sign_transaction](#clientsign_transaction): Sign a transaction without sending it.
- [client.send_transaction](#clientsend_transaction): Send a transaction to the network.
- [client.get_chain_id](#clientget_chain_id): Returns the chain ID of the network in use.
- [admin.create_wallet](#admincreate_wallet): Creates a wallet with its first key-pair.
- [admin.import_wallet](#adminimport_wallet): Import a wallet with its first key-pair with a recovery phrase and a key derivation version.
- [admin.describe_wallet](#admindescribe_wallet): Returns the wallet base information.
- [admin.list_wallets](#adminlist_wallets): Returns the list of the wallets present on the computer.
- [admin.rename_wallet](#adminrename_wallet): Renames a wallet
- [admin.remove_wallet](#adminremove_wallet): Removes a wallet from the computer.
- [admin.list_networks](#adminlist_networks): Returns the list of all registered networks.
- [admin.describe_network](#admindescribe_network): Returns the network information.
- [admin.update_network](#adminupdate_network): Update an existing network.
- [admin.remove_network](#adminremove_network): Removes a network from the computer.
- [admin.import_network](#adminimport_network): Import a network configuration from a file or an URL.
- [admin.generate_key](#admingenerate_key): Generates a key on the specified wallet.
- [admin.describe_key](#admindescribe_key): Returns key's information.
- [admin.list_keys](#adminlist_keys): Returns all generated key of the specified wallet.
- [admin.annotate_key](#adminannotate_key): Attaches metadata to a key.
- [admin.isolate_key](#adminisolate_key): Isolate a key to a specific wallet.
- [admin.rotate_key](#adminrotate_key): Builds a transaction to rotate key on the network.
- [admin.taint_key](#admintaint_key): Marks the specified public key as tainted.
- [admin.untaint_key](#adminuntaint_key): Remove the taint from the specified public key.
- [admin.describe_permissions](#admindescribe_permissions): Returns the permissions set for the specified wallet and hostname.
- [admin.list_permissions](#adminlist_permissions): Returns the permissions summary for all set hostnames.
- [admin.update_permissions](#adminupdate_permissions): Updates the permissions for the specified wallet and hostname.
- [admin.revoke_permissions](#adminrevoke_permissions): Revokes the permissions set in the specified hostname.
- [admin.purge_permissions](#adminpurge_permissions): Purges all the permissions set for all hostname.
- [admin.sign_transaction](#adminsign_transaction): Sign a command using the specified wallet and public key.
- [admin.sign_message](#adminsign_message): Sign any arbitrary message
- [admin.verify_message](#adminverify_message): Verify any arbitrary signature
- [admin.send_transaction](#adminsend_transaction): Sign & send a transaction to a network
- [admin.send_raw_transaction](#adminsend_raw_transaction): Send a signed transaction to a network
- [admin.start_service](#adminstart_service): Start a wallet service.
- [admin.stop_service](#adminstop_service): Stop a wallet service.
- [admin.list_connections](#adminlist_connections): List all the connections of a service.
- [admin.close_connection](#adminclose_connection): Close the connection between a third-party application and a wallet.
- [admin.close_connections_to_hostname](#adminclose_connections_to_hostname): Close the connection from the specified third-party application to any wallet.
- [admin.close_connections_to_wallet](#adminclose_connections_to_wallet): Close the connection from any third-party application to the specified wallet.

---



## `client.connect_wallet`

This method initiates a connection between a wallet and a third-party application.

The user has to review the request, and, if they accept it, select the wallet they want to use for this connection.

A connection token is generated and returned to the third-party application. This token is meant to be used in protected methods.

**Supported connections:**
- Multiple wallets connected for the same hostname. Each connection will have a different token.
- A single wallet connected to multiple hostnames. Each connection will have a different token.
- Combination of the above setups.

However, it's not possible to have multiple connections on the same wallet for the same hostname. The previous connection will be terminated and a new token will be generated.

This method should be the entry point of every third-party application. Once connected, see the method `get_permissions`.

### Parameters

None required

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| token | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |

### Errors
- **Client error** (3000): the user closed the connection
- **Client error** (3001): the user rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Accepting a connection from "vega.xyz"
The third-party application "vega.xyz" requests a connection to a wallet and the user accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.connect_wallet",
    "params": {
        "hostname": "vega.xyz"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

---


## `client.disconnect_wallet`

This method ends the connection between the third-party application and the wallet. The token is, then, no longer valid.

Calling this method with an invalid token doesn't fail.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |





### Examples
#### Disconnection from "vega.xyz"
The third-party application "vega.xyz" requests a disconnection to a wallet using a valid token.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.disconnect_wallet",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `client.get_permissions`

This method returns the permissions set on the wallet for the third-party application.

This method should be called, by the third-party application, right after it successfully connected to a wallet, to ensure it has sufficient permissions to call the method it relies on. If the third-party application doesn't have enough permissions, see the method `request_permissions`.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| permissions | object | The description of the permissions a third-party application has. | The description of the permissions a third-party application has. |



### Examples
#### Get permissions set for "vega.xyz"
The third-party application "vega.xyz" wants to know the permissions that have been set on the wallet in use.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.get_permissions",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "publicKeys": "read"
    }
}
```

---


## `client.request_permissions`

This method allows a third-party application to request new permissions to access the methods it requires.

All permissions the third-party relies on have to be specified. If a permission is omitted, it will be considered as no longer required and, as a result, be automatically revoked.

The user has to review the permissions.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |
| **requestedPermissions** | object | The description of the permissions a third-party application has.<br /><br />`{ "public_keys": "read" }`<br />`{ "public_keys": "none" }` |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| permissions | object | The description of the permissions a third-party application has. | The description of the permissions a third-party application has. |

### Errors
- **Client error** (3000): the user closed the connection
- **Client error** (3001): the user rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Updating permissions for "vega.xyz"
The third-party application "vega.xyz" requests an update of its permissions and the user accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.request_permissions",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "requestedPermissions": {
            "publicKeys": "read"
        }
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "permissions": {
            "publicKeys": "read"
        }
    }
}
```


#### Updating permissions for "vega.xyz" with omitted permission
The third-party application "vega.xyz" omits a permission during the update and the user accepts. This automatically marks the omitted permission as revoked.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.request_permissions",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "requestedPermissions": {}
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "permissions": {
            "publicKeys": "none"
        }
    }
}
```

---


## `client.list_keys`

This method returns the keys the user has allowed the third-party application to have access to.

It requires a `read` access on `public_keys`.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| keys | array | - | - |

### Errors
- **Application error** (2000): a "read" access on public keys is required

### Examples
#### List keys allowed on "vega.xyz"
The third-party application "vega.xyz" wants to list the public keys it has access to.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.list_keys",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "keys": [
            {
                "name": "Key 1",
                "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
            },
            {
                "name": "Key 2",
                "publicKey": "988eae323a07f12363c17025c23ee58ea32ac3912398e16bb0b56969f57adc52"
            }
        ]
    }
}
```

---


## `client.sign_transaction`

This method signs a transaction and returns it to the third-party application, without sending it to the network. What happens with the transaction is up to the third-party application.

The user has to review the transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |
| **publicKey** | string | The Vega public key to use. |
| **transaction** | object | The transaction as a JSON object |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| transaction | object | A transaction that has been signed by the wallet. | A transaction that has been signed by the wallet. |

### Errors
- **Network error** (1000): no healthy node available
- **Network error** (1000): could not get information about the last block on the network
- **Application error** (2000): the public key is not allowed to be used
- **Client error** (3000): the user closed the connection
- **Client error** (3001): the user rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Signing a transaction for "vega.xyz"
The third-party application "vega.xyz" requests to sign a transaction and the user accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.sign_transaction",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "publicKey": "3fd42fd5ceb22d99ac45086f1d82d516118a5cb7ad9a2e096cd78ca2c8960c80",
        "sendingMode": "TYPE_SYNC",
        "encodedTransaction": "ewogICAgInZvdGVTdWJtaXNzaW9uIjogewogICAgICAgICJwcm9wb3NhbElkIjogImViMmQzOTAyZmRkYTljM2ViNmUzNjlmMjIzNTY4OWI4NzFjNzMyMmNmM2FiMjg0ZGRlM2U5ZGZjMTM4NjNhMTciLAogICAgICAgICJ2YWx1ZSI6ICJWQUxVRV9ZRVMiCiAgICB9Cn0K"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "receivedAt": "2021-02-18T21:54:42.123Z",
        "sentAt": "2021-02-18T21:54:42.123Z",
        "txHash": "E8C167126D1FC8D92898AB9C07C318161DF68753A1316A69ABDC9ADC557723B3"
    }
}
```

---


## `client.send_transaction`

This method sends a transaction to the network.

The user has to review the transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | A unique connection token randomly generated for each new connection. It's used to access the protected methods. |
| **publicKey** | string | The Vega public key to use. |
| **sendingMode** | string | The chosen mode to send the transaction:<br />- `TYPE_SYNC` returns the result of running the transaction.<br />- `TYPE_ASYNC` returns right away without waiting to hear if the transaction is even valid.<br />- `TYPE_COMMIT` waits until the transaction is committed in a block or until some timeout is reached or returns return right away if the transaction is not valid. |
| **transaction** | object | The transaction as a JSON object |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| receivedAt | string | The date when the API received the request to send the transaction.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | The date when the API received the request to send the transaction.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. |
| sentAt | string | The date when the transaction has been sent to the network.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | The date when the transaction has been sent to the network.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. |
| transactionHash | string | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it. | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it. |
| transaction | object | A transaction that has been signed by the wallet. | A transaction that has been signed by the wallet. |

### Errors
- **Network error** (1000): no healthy node available
- **Network error** (1000): could not get information about the last block on the network
- **Network error** (1000): the transaction failed
- **Application error** (2000): the public key is not allowed to be used
- **Client error** (3000): the user closed the connection
- **Client error** (3001): the user rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Sending a transaction for "vega.xyz"
The third-party application "vega.xyz" requests to send a transaction and the user accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.send_transaction",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "publicKey": "3fd42fd5ceb22d99ac45086f1d82d516118a5cb7ad9a2e096cd78ca2c8960c80",
        "sendingMode": "TYPE_SYNC",
        "encodedTransaction": "ewogICAgInZvdGVTdWJtaXNzaW9uIjogewogICAgICAgICJwcm9wb3NhbElkIjogImViMmQzOTAyZmRkYTljM2ViNmUzNjlmMjIzNTY4OWI4NzFjNzMyMmNmM2FiMjg0ZGRlM2U5ZGZjMTM4NjNhMTciLAogICAgICAgICJ2YWx1ZSI6ICJWQUxVRV9ZRVMiCiAgICB9Cn0K"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "receivedAt": "2021-02-18T21:54:42.123Z",
        "sentAt": "2021-02-18T21:54:42.123Z",
        "txHash": "E8C167126D1FC8D92898AB9C07C318161DF68753A1316A69ABDC9ADC557723B3"
    }
}
```

---


## `client.get_chain_id`

This method returns the chain ID of the network in use.

It should be called by every third-party application to know from which network it should fetch data.

### Parameters

None required

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| chainID | string | The chain identifier | The chain identifier |

### Errors
- **Network error** (1000): no healthy node available
- **Network error** (1000): could not get information about the last block on the network

### Examples
#### Fetching the chain ID
An example of requesting the chain's ID

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "client.get_chain_id",
    "params": []
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "chainID": "test-chain-Thz9c6"
    }
}
```

---


## `admin.create_wallet`

This method creates a HD wallet (with version 2 of the key derivation) and generates its first key-pair the cryptographic algorithm ed25519.

The passphrase will be used to encrypt the wallet and its keys.

If successful, the wallet is ready to use for sending transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| wallet | object | the newly generated wallet | the newly generated wallet |
| key | object | the first public key generated | the first public key generated |



### Examples
#### Creating a wallet


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.create_wallet",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "wallet": {
            "name": "my-wallet",
            "keyDerivationVersion": 2,
            "recoveryPhrase": "swing ceiling chaos green put insane ripple desk match tip melt usual shrug turkey renew icon parade veteran lens govern path rough page render",
            "filePath": "some/path/to/my-wallet"
        },
        "key": {
            "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
            "algorithm": {
                "name": "vega/ed25519",
                "version": 1
            },
            "metadata": [
                {
                    "key": "name",
                    "value": "my-wallet key 1"
                }
            ]
        }
    }
}
```

---


## `admin.import_wallet`

This method imports a wallet using the specified recovery phrase and a key derivation version, and generates its first key-pair.

The passphrase will be used to encrypt the wallet and its keys.

If successful, the wallet is ready to use for sending transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **recoveryPhrase** | string | - |
| **keyDerivationVersion** | number | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| wallet | object | the imported wallet | the imported wallet |
| key | object | the first public key generated | the first public key generated |



### Examples
#### Importing a wallet


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.import_wallet",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "recoveryPhrase": "swing ceiling chaos green put insane ripple desk match tip melt usual shrug turkey renew icon parade veteran lens govern path rough page render",
        "keyDerivationVersion": "2"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "wallet": {
            "name": "my-wallet",
            "keyDerivationVersion": 2,
            "filePath": "some/path/to/my-wallet"
        },
        "key": {
            "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
            "algorithm": {
                "name": "vega/ed25519",
                "version": 1
            },
            "metadata": [
                {
                    "key": "name",
                    "value": "my-wallet key 1"
                }
            ]
        }
    }
}
```

---


## `admin.describe_wallet`

This method returns the wallet base information such as its name, ID, type and key derivation version. It doesn't return the keys nor the permissions.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| name | string | - | - |
| keyDerivationVersion | number | - | - |
| id | string | - | - |
| type | string | - | - |



### Examples
#### Getting wallet base information


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.describe_wallet",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "name": "my-wallet",
        "keyDerivationVersion": 2,
        "type": "HD Wallet",
        "id": "7ffa36b2fb99d8404e9448f0d2ce944055e64c36d895d1fde044c867bfdf779f"
    }
}
```

---


## `admin.list_wallets`

This method returns the list of the wallets present on the computer. It is alphabetically sorted.

### Parameters

None required

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| wallets | array | - | - |



### Examples
#### Getting the list of wallets


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_wallets",
    "params": []
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "wallets": [
            "wallet-1",
            "wallet-2"
        ]
    }
}
```

---


## `admin.rename_wallet`

This method renames a wallet in-place.

If the new name matches an existing wallet, it fails.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **newName** | string | - |
| **passphrase** | string | - |

### Result: `Success`



### Examples
#### Rename a wallet


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.rename_wallet",
    "params": {
        "wallet": "my-wallet",
        "newWallet": "my-new-wallet-name",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.remove_wallet`

This method removes a wallet from the computer.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |

### Result: `Success`



### Examples
#### Remove a wallet


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.remove_wallet",
    "params": {
        "wallet": "my-wallet"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.list_networks`

This method returns the list of the registered networks.

### Parameters

None required

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| networks | array | - | - |



### Examples
#### Getting the list of networks


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_networks",
    "params": []
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "networks": [
            "mainnet",
            "fairground",
            "local-network"
        ]
    }
}
```

---


## `admin.describe_network`

This method returns the network information.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **name** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| name | string | - | - |
| logLevel | string | - | - |
| tokenExpiry | string | - | - |
| port | integer | - | - |
| host | string | - | - |
| api | object | The API configuration for the network. | The API configuration for the network. |



### Examples
#### Describing a network


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.describe_network",
    "params": {
        "name": "local-network"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "name": "local-network",
        "logLevel": "info",
        "tokenExpiry": "168h0m0s",
        "port": 1789,
        "host": "localhost",
        "api": {
            "grpcConfig": {
                "hosts": [
                    "localhost:3028"
                ],
                "retries": 5
            },
            "graphQLConfig": {
                "hosts": [
                    "localhost:3028"
                ]
            },
            "restConfig": {
                "hosts": [
                    "localhost:3029"
                ]
            }
        }
    }
}
```

---


## `admin.update_network`

This method updates the network configuration.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **name** | string | - |
| **logLevel** | string | - |
| **tokenExpiry** | string | - |
| **port** | integer | - |
| **host** | string | - |
| **api** | object | The API configuration for the network.<br /><br /><br /><br /> |

### Result: `Success`



### Examples
#### Update a network


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.update_network",
    "params": {
        "name": "local-network",
        "level": "info",
        "tokenExpiry": "168h0m0s",
        "port": "1789",
        "host": "localhost",
        "api": {
            "grpcConfig": {
                "hosts": [
                    "localhost:3028"
                ],
                "retries": 5
            },
            "graphQLConfig": {
                "hosts": [
                    "localhost:3028"
                ]
            },
            "restConfig": {
                "hosts": [
                    "localhost:3029"
                ]
            }
        }
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.remove_network`

This method removes a network from the computer.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **name** | string | - |

### Result: `Success`



### Examples
#### Remove a network


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.remove_network",
    "params": {
        "network": "fairground"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.import_network`

Import a network configuration from a file or an URL.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| name _(Optional)_ | string | - |
| **filePath** | string | - |
| **url** | string | - |
| **overwrite** | boolean | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| name | string | - | - |
| filePath | string | - | - |



### Examples
#### Importing a network


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.import_network",
    "params": {
        "name": "local-network",
        "filePath": "/Users/username/local-network.toml"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "name": "local-network",
        "filePath": "/Users/username/vega-home/wallet-service/networks/local-network.toml"
    }
}
```

---


## `admin.generate_key`

This method generates a key on the specified wallet.

Metadata can be attached to this key.

A special metadata `name` can be provided to name the key. If no `name` is provided, a default name is generated.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **metadata** | array | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| publicKey | string | The Vega public key to use. | The Vega public key to use. |
| algorithm | object | The algorithm used to generate the key. | The algorithm used to generate the key. |
| metadata | array | - | - |



### Examples
#### Generating a key


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.generate_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "metadata": [
            {
                "name": "portfolio",
                "value": "btc"
            }
        ]
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
        "algorithm": {
            "name": "vega/ed25519",
            "version": 1
        },
        "metadata": [
            {
                "key": "portfolio",
                "value": "btc"
            },
            {
                "key": "name",
                "value": "Key 1"
            }
        ]
    }
}
```

---


## `admin.describe_key`

This method returns the information of the specified key.

It doesn't return the private key for security reasons.  If you need something that requires a private key, you should use the available endpoints and let them handle the private key for you.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **publicKey** | string | The Vega public key to use. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| publicKey | string | The Vega public key to use. | The Vega public key to use. |
| algorithm | object | The algorithm used to generate the key. | The algorithm used to generate the key. |
| metadata | array | - | - |
| isTainted | boolean | Tells if the key is tainted or not. A tainted key cannot be used for signing and sending transaction, for example. | Tells if the key is tainted or not. A tainted key cannot be used for signing and sending transaction, for example. |



### Examples
#### Getting key base information


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.describe_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
        "algorithm": {
            "name": "vega/ed25519",
            "version": 1
        },
        "metadata": [
            {
                "key": "portfolio",
                "value": "btc"
            },
            {
                "key": "name",
                "value": "Key 1"
            }
        ],
        "isTainted": false
    }
}
```

---


## `admin.list_keys`

This method returns all generated key of the specified wallet with their respective name.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| keys | array | - | - |



### Examples
#### Listing the keys


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_keys",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "keys": [
            {
                "name": "Key 1",
                "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
            }
        ]
    }
}
```

---


## `admin.annotate_key`

This method attaches metadata to the specified key.

A special metadata `name` can be provided to name the key. If no `name` is provided, a default name is generated.

This method **replaces** the existing metadata by the specified ones. It does **not** update in place.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **publicKey** | string | The Vega public key to use. |
| **metadata** | array | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| metadata | array | - | - |



### Examples
#### Annotating the key


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.annotate_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
        "metadata": [
            {
                "name": "portfolio",
                "value": "btc"
            }
        ]
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "metadata": [
            {
                "key": "portfolio",
                "value": "btc"
            },
            {
                "key": "name",
                "value": "Key 1"
            }
        ]
    }
}
```

---


## `admin.isolate_key`

This method isolates a key in a specific wallet called an "isolated wallet". This isolated wallet contains a single key. It can't generate keys, and is stripped of the master key. Generally, it can only sign transactions.

This is a security feature that **lowers** the impact of having a wallet stolen. If a wallet is stolen and the attacker breaks into it, he has access to all keys. On an isolated wallet, it can only retrieve the isolated key.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **isolatedWalletPassphrase** | string | - |
| **publicKey** | string | The Vega public key to use. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| wallet |  | Name of the generated isolated wallet | Name of the generated isolated wallet |
| filePath |  | Path to the isolated wallet file | Path to the isolated wallet file |



### Examples
#### Isolating a key


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.isolate_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "isolatedWalletPassphrase": "this-is-also-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "wallet": "my-wallet.b5fd9d3c.isolated",
        "filePath": "some/path/to/my-wallet.b5fd9d3c.isolated"
    }
}
```

---


## `admin.rotate_key`

This method builds a transaction to rotate key on the network.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **fromPublicKey** | string | The current public key |
| **toPublicKey** | string | The next public key to rotate to |
| **chainID** | string | The chain identifier |
| **submissionBlockHeight** | string | The block height (approximation) at which the transaction will be submitted |
| **enactmentBlockHeight** | string | The block height at which the rotation should happen |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| masterPublicKey |  | The master public key of the wallet used to sign the transaction | The master public key of the wallet used to sign the transaction |
| encodedTransaction |  | The base64-encoded key rotation transaction | The base64-encoded key rotation transaction |



### Examples
#### Rotating a key


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.rotate_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "fromPublicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0",
        "toPublicKey": "988eae323a07f12363c17025c23ee58ea32ac3912398e16bb0b56969f57adc52",
        "chainID": "test-chain-Thz9c6",
        "submissionBlockHeight": 10,
        "enactmentBlockHeight": 15
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "masterPublicKey": "9df682a3c87d90567f260566a9c223ccbbb7529c38340cf163b8fe199dbf0f2e",
        "encodedTransaction": "CqsBdGVzdC1jaGFpbi1UaHo5YzYACPfdurmpppHlogEQCqp9iAEIAhAPGkA5ODhlYWUzMjNhMDdmMTIzNjNjMTcwMjVjMjNlZTU4ZWEzMmFjMzkxMjM5OGUxNmJiMGI1Njk2OWY1N2FkYzUyIkA4MWFhZjk2NmU4ZjUxNDIzZjBiZDFkOTMzYWQ0NmY5NjJlMjNiY2Q3MTg4ZWQzZmUwZjUzZjRkYThhMzJhOWVlEpMBCoABYzg3NDVkODhlMWQ1YTBhOGE3NGI5YzRmN2QyMzQ3ZmQ5ZDY1NzIwYTQ3ZmYwNWU3YTZmZmYyOTA0NzhmOTU0M2NjM2E4MzJkNjBmYTJiNmY3ZTQ3YWJlMjE0MGIwOTEyNzBlNTAxZTA5MjVjNDg3NzEwMjViOTkyYTg1ZTAxMDQSDHZlZ2EvZWQyNTUxORgBgH0D0j5AOWRmNjgyYTNjODdkOTA1NjdmMjYwNTY2YTljMjIzY2NiYmI3NTI5YzM4MzQwY2YxNjNiOGZlMTk5ZGJmMGYyZQ=="
    }
}
```

---


## `admin.taint_key`

This method marks the specified public key as tainted. It makes it unusable for transaction signing.

When a key is tainted, it is automatically removed from the restricted keys if specified. If the key is the only one to be set, the permission to access the public keys is revoked. If no restricted key is specified, but all keys in the wallet are tainted, the permission of the public keys is revoked as well.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **publicKey** | string | The Vega public key to use. |

### Result: `Success`



### Examples
#### Tainting a key


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.taint_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.untaint_key`

This method removes the taint from the specified public key.

If you tainted a key for security reasons, you should not use it.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **publicKey** | string | The Vega public key to use. |

### Result: `Success`



### Examples
#### Remove the taint from a key


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.untaint_key",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "publicKey": "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.describe_permissions`

This method returns the permissions set for the specified wallet and hostname.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **hostname** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| permissions | object | The full description of the permissions a third-party application has. | The full description of the permissions a third-party application has. |



### Examples
#### Describe the permissions


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.describe_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "hostname": "vega.xyz"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "permissions": {
            "publicKeys": {
                "access": "read",
                "restrictedKeys": [
                    "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
                ]
            }
        }
    }
}
```

---


## `admin.list_permissions`

This method returns the permissions summary for all set hostnames.

For a detailed description of the permissions on a given hostname, see `admin.describe_permissions`

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| permissions | object | - | - |



### Examples
#### List the permissions


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "permissions": {
            "vega.xyz": {
                "public_keys": "read"
            },
            "token.vega.xyz": {
                "public_keys": "none"
            }
        }
    }
}
```

---


## `admin.update_permissions`

This method updates the permissions for the specified wallet and hostname.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **hostname** | string | - |
| **permissions** | object | The full description of the permissions a third-party application has.<br /><br /> |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| permissions | object | The full description of the permissions a third-party application has. | The full description of the permissions a third-party application has. |



### Examples
#### Update the permissions


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.update_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "hostname": "vega.xyz",
        "permissions": {
            "publicKeys": {
                "access": "read",
                "restrictedKeys": [
                    "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
                ]
            }
        }
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "permissions": {
            "publicKeys": {
                "access": "read",
                "restrictedKeys": [
                    "b5fd9d3c4ad553cb3196303b6e6df7f484cf7f5331a572a45031239fd71ad8a0"
                ]
            }
        }
    }
}
```

---


## `admin.revoke_permissions`

This method revokes the permissions set in the specified hostname.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **hostname** | string | - |

### Result: `Success`



### Examples
#### Revoke the permissions


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.revoke_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "hostname": "vega.xyz"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.purge_permissions`

This method purges all the permissions set for all hostname.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |

### Result: `Success`



### Examples
#### Purge the permissions


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.purge_permissions",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.sign_transaction`

This method signs a transaction returning a base64-encoded transaction that can be sent using the method `admin.send_transaction`

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **pubKey** | string | - |
| **chainId** | string | - |
| **blockHeight** | integer | - |
| network _(Optional)_ | integer | - |
| **transaction** | object | The transaction as a JSON object |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| encodedTransaction | string | - | - |



---


## `admin.sign_message`

This method signs any given message with a Vega public-key

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **pubKey** | string | - |
| **encodedMessage** | string | The message to sign encoded using base-64. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| encodedSignature | string | - | - |



### Examples
#### Sign a message


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.sign_message",
    "params": {
        "wallet": "my-wallet",
        "passphrase": "this-is-not-a-good-passphrase",
        "pubKey": "0101010101010101010101010101010101010101010101010101010101010101",
        "encodedMessage": "U3VwZXIgc2VjcmV0IG1lc3NhZ2U="
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "encodedSignature": "6a2Ud6yuNcnOaO8jaiTJJi8dZBQzvNySV2Tt2hD+YhVnz1dNxHGUavU2a1W1z0/1uX0n91x2jWXONMRpiiNODg=="
    }
}
```

---


## `admin.verify_message`

This method verifies any given signature with a Vega public-key

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **pubKey** | string | - |
| **encodedMessage** | string | The message use to create the signature, encoded using base-64. |
| **encodedSignature** | string | The signature to verify, encoded using base-64. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| isValid | string | - | - |



---


## `admin.send_transaction`

This method signs a transaction returning a base64-encoded transaction that can be sent using the method `admin.send_transaction`

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **wallet** | string | - |
| **passphrase** | string | - |
| **pubKey** | string | - |
| network _(Optional)_ | integer | - |
| **sendingMode** | string | The chosen mode to send the transaction:<br />- `TYPE_SYNC` returns the result of running the transaction.<br />- `TYPE_ASYNC` returns right away without waiting to hear if the transaction is even valid.<br />- `TYPE_COMMIT` waits until the transaction is committed in a block or until some timeout is reached or returns return right away if the transaction is not valid. |
| **transaction** | object | The transaction as a JSON object |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| receivedAt | string | The date when the API received the request to send the transaction.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | The date when the API received the request to send the transaction.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. |
| sentAt | string | The date when the transaction has been sent to the network.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | The date when the transaction has been sent to the network.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. |
| transactionHash | string | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it. | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it. |
| transaction | object | A transaction that has been signed by the wallet. | A transaction that has been signed by the wallet. |



---


## `admin.send_raw_transaction`

This method sends a transaction that was signed using admin.sign_transaction into a network

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **encodedTransaction** | string | The signed transaction to be sent, encoded using base-64. |
| **network** | string | The network to send the transaction to. |
| **nodeAddress** | string | The node address to send the transaction to. |
| **retries** | integer | the number of times sending the transaction should be attempted if it fails |
| **sendingMode** | string | The chosen mode to send the transaction:<br />- `TYPE_SYNC` returns the result of running the transaction.<br />- `TYPE_ASYNC` returns right away without waiting to hear if the transaction is even valid.<br />- `TYPE_COMMIT` waits until the transaction is committed in a block or until some timeout is reached or returns return right away if the transaction is not valid. |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| receivedAt | string | The date when the API received the request to send the transaction.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | The date when the API received the request to send the transaction.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. |
| sentAt | string | The date when the transaction has been sent to the network.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | The date when the transaction has been sent to the network.<br /><br />The time is a quoted string in RFC 3339 format, with sub-second precision added if present. |
| transactionHash | string | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it. | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it. |
| transaction | object | A transaction that has been signed by the wallet. | A transaction that has been signed by the wallet. |



---


## `admin.start_service`

This method starts a wallet service targeting the specified network.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **network** | string | - |
| **noVersionCheck** | boolean | - |

### Result: `Success`



### Examples
#### Start the service


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.start_service",
    "params": {
        "network": "mainnet1",
        "noVersionCheck": false
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.stop_service`

This method stops the wallet service targeting the specified network. This automatically disconnects all the wallets used in the service.

It does not fail if there is no service running for this network.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **network** | string | - |

### Result: `Success`



### Examples
#### Stop a running service


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.stop_service",
    "params": {
        "network": "mainnet1"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```


#### Stop a non-running service


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.stop_service",
    "params": {
        "network": "network-without-running-service"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.list_connections`

This method lists all the connections of a service.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **network** | string | - |

### Result: `Success`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| activeConnections | array | The list is sorted by hostname, then by wallet name. | The list is sorted by hostname, then by wallet name. |



### Examples
#### List the connection of a service


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.list_connections",
    "params": {
        "network": "mainnet1"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": {
        "activeConnections": [
            {
                "hostname": "console.vega.xyz",
                "wallet": "my-btc-wallet"
            },
            {
                "hostname": "vega.xyz",
                "wallet": "my-btc-wallet"
            },
            {
                "hostname": "vega.xyz",
                "wallet": "my-eth-wallet"
            }
        ]
    }
}
```

---


## `admin.close_connection`

This method closes the connection between a third-party application and a wallet opened in the service that run against the specified network.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **network** | string | - |
| **hostname** | string | - |
| **wallet** | string | - |

### Result: `Success`



### Examples
#### Close a connection


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.close_connection",
    "params": {
        "network": "mainnet1",
        "hostname": "vega.xyz",
        "wallet": "my-btc-wallet"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.close_connections_to_hostname`

This method closes all the connections from the specified hostname to any wallet opened in the service that run against the specified network.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **network** | string | - |
| **hostname** | string | - |

### Result: `Success`



### Examples
#### Close all connections to a given hostname


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.close_connections_to_hostname",
    "params": {
        "network": "mainnet1",
        "hostname": "vega.xyz"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```

---


## `admin.close_connections_to_wallet`

This method closes all the connections from any hostname to the specified wallet opened in the service that run against the specified network.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **network** | string | - |
| **wallet** | string | - |

### Result: `Success`



### Examples
#### Close all connections to a given wallet


##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "admin.close_connections_to_wallet",
    "params": {
        "network": "mainnet1",
        "wallet": "my-btc-wallet"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": null
}
```


