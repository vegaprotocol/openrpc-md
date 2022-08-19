# openrpc-md

> A very simple OpenRPC to Markdown documentation generator for very simple OpenRPC specs

# Usage

Specify an OpenRPC json file when
```bash
npx @vegaprotocol/openrpc-md ./sample/openrpc.json
```

# Example
- [openrpc.json](./sample/openrpc.json) produces [output.md](./sample/output.md)

# Alternatives
A much richer set of tools is available from [Open RPC](https://github.com/open-rpc/), specifically:

- [open-rpc/generator](https://github.com/open-rpc/generator) can generate Gatsby docs
- [open-rpc/playground](https://github.com/open-rpc/playground) creates an interactive UI for reading about & executing queries
- [openrpc/docs-react](https://github.com/open-rpc/docs-react) is a [React](https://github.com/facebook/react) component to render just the documentation

But if none of those work for yoru configuration and all you want is [Markdown](https://www.markdownguide.org/), then you might be in the right place.

# [MIT](LICENSE.md)
MIT
