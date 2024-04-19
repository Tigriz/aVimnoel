# ![Logo](img/avimnoel64x64.png) aVimnoel

Add a vim-like mode to navigate on avenoel with your keyboard only
Keybinds:
- `r` or `F5` refreshes
  - if in a topic, also scrolls to bottom 
- `i` scrolls to and focuses message form
- `h` goes to first page of a topic
- `H` goes to top of current page
- `j` goes to previous page
- `k` goes to next page
- `l` goes to last page of a topic
- `L` goes to bottom of current page
- top keyboard row (numbers and chars) navigates from first to 13th topic/message, `Shift` to go from 14th to 26th (it does not exist but who cares, it doesn't crash the script)
  - `Ctrl` goes to the bottom of the last page of a topic 
- `Alt` shows hints
- `:` opens vim prompt; can be exited using `Escape`
  - `:w` posts a message
  - `:q` goes back to the forum menu 
  - `:wq` posts a message and go back to the forum menu (does not work atm but will fix later)
  - `:[number]` navigates to corresponding topic/message (indexed from 0)
- `Backspace` navigates to previous page
