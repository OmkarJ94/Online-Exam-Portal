import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css" rel="stylesheet" />

        <link
          href="https://fonts.googleapis.com/css?family=Itim&display=swap"
          rel="stylesheet"
        />


      </Head>
      <body>
        <Main />
        <NextScript >

          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.js"></script>
        </NextScript>
      </body>
    </Html>
  )
}
