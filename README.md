# void

A webpage where you can speak out about your thoughts. Type it in and save entries as an image.

This app can be booted in three simple steps: 
- downloading this repository
- run the commands below in terminal 
- open http://localhost:3000, preferably a browser other than Safari         

And requires no extra setup. Font-switching demonstration:

![Alt text](/public/interface-nunito.jpg)
![Alt text](/public/interface-lora.jpg)

## Download

Requires Node.js 18.18+ (Node.js 20+ recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

- Entries are kept in React state and disappear when the page is refreshed.
- The generated background image is stored at `public/stardew.png`.
- This is a front-end starter; persistence can be added later with a database or browser storage.