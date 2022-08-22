---
    title: Sample wallet API
---
- [session.connect_wallet](#sessionconnect_wallet): Initiates a connection between a wallet and a third-party application.
- [session.disconnect_wallet](#sessiondisconnect_wallet): Ends the connection between the third-party application and the wallet.
- [session.get_permissions](#sessionget_permissions): Returns the permissions set on the wallet for the third-party application.
- [session.request_permissions](#sessionrequest_permissions): Requests permissions update for the third-party application.
- [session.list_keys](#sessionlist_keys): Returns the keys the client has allowed the third-party application to have access to.
- [session.send_transaction](#sessionsend_transaction): Send a transaction to the network.
- [session.get_chain_id](#sessionget_chain_id): Returns the chain ID of the network in use.

---



## `session.connect_wallet`

This method initiates a connection between a wallet and a third-party application.

The client has to review the request, and, if they accept it, select the wallet they want to use for this connection.

A connection token is generated and returned to the third-party application. This token is meant to be used in protected methods.

**Supported connections:**
- Multiple wallets connected for the same hostname. Each connection will have a different token.
- A single wallet connected to multiple hostnames. Each connection will have a different token.
- Combination of the above setups.

However, it's not possible to have multiple connections on the same wallet for the same hostname. The previous connection will be terminated and a new token will be generated.

This method should be the entry point of every third-party application. Once connected, see the method `get_permissions`.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **hostname** | string | The name of the third-party application initiating the connection. |

### Result: `token`

### Errors
- **Client error** (3000): the client closed the connection
- **Client error** (3001): the client rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Accepting a connection from "vega.xyz"
The third-party application "vega.xyz" requests a connection to a wallet and the client accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.connect_wallet",
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


## `session.disconnect_wallet`

This method ends the connection between the third-party application and the wallet. The token is, then, no longer valid.

Calling this method with an invalid token doesn't fail.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | - |

### Result: `No result`



### Examples
#### Disconnection from "vega.xyz"
The third-party application "vega.xyz" requests a disconnection to a wallet using a valid token.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.disconnect_wallet",
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


## `session.get_permissions`

This method returns the permissions set on the wallet for the third-party application.

This method should be called, by the third-party application, right after it successfully connected to a wallet, to ensure it has sufficient permissions to call the method it relies on. If the third-party application doesn't have enough permissions, see the method `request_permissions`.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | - |

### Result: `permissions`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| public_keys | string | The different access modes a permission can have. | -|



### Examples
#### Get permissions set for "vega.xyz"
The third-party application "vega.xyz" wants to know the permissions that have been set on the wallet in use.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.get_permissions",
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
        "public_keys": "read"
    }
}
```

---


## `session.request_permissions`

This method allows a third-party application to request new permissions to access the methods it requires.

All permissions the third-party relies on have to be specified. If a permission is omitted, it will be considered as no longer required and, as a result, be automatically revoked.

The client has to review the permissions.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | - |
| **requestedPermissions** | object | - |

### Result: `permissions`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| public_keys | string | The different access modes a permission can have. | -|

### Errors
- **Client error** (3000): the client closed the connection
- **Client error** (3001): the client rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Updating permissions for "vega.xyz"
The third-party application "vega.xyz" requests an update of its permissions and the client accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.request_permissions",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG",
        "requestedPermissions": {
            "public_key": "read"
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
            "public_key": "read"
        }
    }
}
```


#### Updating permissions for "vega.xyz" with omitted permission
The third-party application "vega.xyz" omits a permission during the update and the client accepts. This automatically marks the omitted permission as revoked.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.request_permissions",
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
            "public_key": "none"
        }
    }
}
```

---


## `session.list_keys`

This method returns the keys the client has allowed the third-party application to have access to.

It requires a `read` access on `public_keys`.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | - |

### Result: `keys`

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
    "method": "session.list_keys",
    "params": {
        "token": "hZKSx0snBvikp2NGMJdKPHU5qvloSeqpqbJg6BsMwCcqX4iZvvy99BV2l13oeyEG"
    }
}
```

##### Result
```json
{
    "name": "Success",
    "value": [
        "0xdeadbeef",
        "0xcafedude"
    ]
}
```

---


## `session.send_transaction`

This method sends a transaction to the network.

The client has to review the transaction.

### Parameters
| Parameter name  |  Type  |  Description |
|------------------|--------|--------|
| **token** | string | - |
| **publicKey** | string | - |
| **sendingMode** | string | The chosen mode to send the transaction:<br />- `TYPE_SYNC` returns the result of running the transaction.<br />- `TYPE_ASYNC` returns right away without waiting to hear if the transaction is even valid.<br />- `TYPE_COMMIT` waits until the transaction is committed in a block or until some timeout is reached or returns return right away if the transaction is not valid. |
| **encodedTransaction** | string | - |

### Result: `transaction_status`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| receivedAt | string | The date when the API received the request to send the transaction. The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | `"2021-02-18T21:54:42.123Z"`|
| sentAt | string | The date when the transaction has been sent to the network. The time is a quoted string in RFC 3339 format, with sub-second precision added if present. | `"2021-02-18T21:54:42.123Z"`|
| transactionHash | string | The hash of the transaction. It's used to uniquely identify the transaction and can be used in the block explorer to retrieve it. | -|

### Errors
- **Network error** (1000): no healthy node available
- **Network error** (1000): couldn't get information about the last block on the network
- **Network error** (1000): the transaction failed
- **Application error** (2000): the public key is not allowed to be used
- **Client error** (3000): the client closed the connection
- **Client error** (3001): the client rejected the request
- **Server error** (-32001): the request has been interrupted

### Examples
#### Sending a transaction for "vega.xyz"
The third-party application "vega.xyz" requests to send a transaction and the client accepts.

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.send_transaction",
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


## `session.get_chain_id`

This method returns the chain ID of the network in use.

It should be called by every third-party application to know from which network it should fetch data.

### Parameters

None required

### Result: `chainID`
| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|
| chainID | string | The identifier for the chain | `"test-chain-Thz9c6"`|

### Errors
- **Network error** (1000): no healthy node available
- **Network error** (1000): couldn't get information about the last block on the network

### Examples
#### Fetching the chain ID
An example of requesting the chain's ID

##### Parameters
```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "session.get_chain_id",
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


