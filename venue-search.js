/* Orcha Events venue search
   Usage in the Squarespace Code block on the Venues page:
     <div id="wd2-venues-root"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/venue-search.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Venues come from venues.json (the same file the venue pages use), so a venue
   added or changed there shows up here automatically. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/Orcha-code/main/venues-orcha.json';
  // Small Orcha Events logo shown in the corner of each venue photo
  var WD2_MARK_TAG = '<img class="wdvs-mark" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAACWCAYAAAA16tGYAAAux0lEQVR42u19eXhc1Xn3e+69s2lmtMuyJGTLxLIx2AYCxsaG2KY0C8WUkJq0zdakiSFfShOStCVpWssk+fqkTfi+tGmfxwkpLYTQTw7gsAiMANnG2LKRF6zN1mLts6935s7dz/n+4B7leiLZ0swdsJbzPHoSZM2de875nff9vesBWByLY3EsjsWxOBbHfBuEEGT8MMYPO91Pc3MzSwhhdu/ezdDPLa7gwhrI2HyWEMIZ/8sAgBVAQCYA0mcvKICh+SxljPnROWKEEJnqb1taWopra2srEEJlRUVFJaWlpR6n0+lUVdUGACwAEIZhVEKILopiJpVKpROJBF9UVBTt7e2N33///elp3mESqE1NTWTPnj14EUhzB0AMADAMw2iEXIQbdPbs2RVlZWXLbDbbNRzHfcjpdDYQQuo5jqu12WxlhBAbAHAMw7AMw0z5fF3XCSFEBwANABRVVWMYYz8AjEmSdEFV1T6Mcd/IyMjw5s2bJ6YAN2uAGi8C6coED2IYRqfg2bVrl+2BBx5YvnTp0ls8Hs8WlmVvstlsywGg2m63X27exPiZbs0u+XlFUTQA8GmaNqSq6qlEInE0nU6fWLt27TgAYAAAhBBgjFkAIPMNVHORIFOeMwme4eHhLfF4/NF0On1QkqQU+f2BCSGqrusaIUQjhOi6rmPj95jMYGCM6XOw8VndeJZq/Pzec0RRjAmC8GosFvtOb2/vTWYwmkg8WpRI7y/3YRFCGv3d0NDQjV6v9x6Xy/VJu92+huM4u+kjGGNMGIYBjDFjqKxCz5tkSTUEAIxJPYqSJJ0WRfH5WCz28urVq3tN8+MAQJ+Ozy0OiyQQ/e/29vZin8/32Uwm85okSUKWAFANCTEjCZMlraiE0c3D9Ducw3Pps6nUmhyyLEeTyeRzFy5cuKe5udllllKLroUCAujQoUM1wWDw7zKZTPcU4NFnscnZKmm2wNPp5wyg4VmCSs8GVSaTOR4IBHY99dRTxXMNUOgKBxGLENIBAI4ePVrX2Nj4FY/H8xWn01lLdRbDMMRQG2gGzwPjeQQAuOx/1zQNY4x5jHEaADIsy0qUHGOMbQDgBAA3wzAlNpvNNY1K0433YWahBrFZ/Ymi2JdKpX7W09Pz1Pbt2xOUmNO1WATSDEdzczO7c+dOghDCLS0txRs2bHjA6/V+zeFwLKc0I5t3XGZgY8MmJZuqqgrGeFyW5TO6rp9Jp9P9drt9RJKk5NjYWFqSJMHv90vhcBjzPI82btzIqarqqqmpcS9fvrxYkqQlbrd7Fcuyq+x2+xqbzbYWIVTNcRwyf6fBy1Au76koSk8qlXrs6aef/tXXv/512ZDMi1beDNXYpKQYHR39c1EUz5rVl8FRZqN+NPofiqJIgiC0xmKxRwYGBrb8y7/8i/uyJw0hQOjyOHjppZeWDg8P3x2Px/8pk8mcNiw7s9rN+b0FQTgyMTHxUfpdbW1t3CJaLuELohvW3d19XSqVes60sJqxuLMltoQQQiRJ6o/FYv909uzZ9WapRL83O2xijqNN8TMZj2tra5syHNLW1ubp7+/fnkgkfinLcsgMqCyAXRpN73EvjRBCVFXVeZ7/ZX9/f705PriInIs3kwMA2Lp1KxcMBv9GluWY6WTqs7SONJPv5lwwGPza4cOHq8wSxgANY6VqN/m1LpIWPT09q8Lh8A8lSYpMBfJZzAkbVt5YJBL5kplHLgLIOOEAAAMDA2szmcybUwFitlJIkqRQMBh8pLm5ucSsDqwGz+XmZd7kEydOXJ1MJv9VlmU5GxyzmN+klZdKpZ7v6upaRg/igpVO5kUOh8NfFUUxkeMCXwS6VCq1r6ura6VZ2n2Qi5wNqHPnzm3hef7tLDfAbAb1axFJkoaGh4f/JPtQLpjR3NzMAgD86Ec/8iYSiZ/nIYUmPyOKYiocDu+6UgB0KUPi4YcfdoXD4SZN03Ket67rKiGEaJpG4vH497PijvN/dHR02AAAxsfHV6fT6fYsZ+Jsh2pYNZ2Dg4O3mBx4zJV+iAAAfD7fXSbulMshmuSQPM+/1NnZWW/mnPOeVPf19X1UkiS/GQy5SiJBEFqee+65irm0gB0dHUVtbW3bnnjiiRs6OzvvE0XxLUPKaDmuhUqNi8HBwfUfxFq8XycXEUI4hJA2MTHxZw0NDc85HI6lGGN9Kg/zDIYKAKwgCP/v3Xff/dR9990XNbzg2lwAkqZpXCqV8q5cudLT29vb/cwzz/wdz/PjDMOwRp7TbAcHAJrT6Vx91VVXvXbhwoWPIoQ0Kv3ni2cbEUIQQgj7fL6Hq6qqHuM4jnpxcwGyBgBcKpV6aseOHV86dOiQZvig8Fzyme3bt+8qr9frcrlc5aFQqLyhoaF87dq1n3e5XHfSOebwaB0AWEVRxFgs9qWampr/oQd4rmuzyYCr3+//To7ORTPBpOrsGZq/s3v3bmaOpcBAS0tL8aFDhx74zW9+c9exY8caW1tbSwAAdu/ebU+lUi/nwZmoExNrmqaGw+HPzQvOREEUCAR2m8ghzocTpVKpA3v37i2aw57dyXd+9dVX61999dVPHTlypJYQYiOEMB0dHSU8zx/LB0x0nVVVVYPB4BfNRs6cJdbBYPDbefiHzAtDBEHoeeWVV2oM7zQzVx2wzc3N7Jtvvvmx3/72t3e/8cYbq41c8clx8uTJ5YIgDJokTD5gwsFgsOCSCRUKRAghLRgM/kVFRcV/siyLZ5rqAVNHxJGiKKnR0dHtjY2Np8zpJXN1vPjii42JRMJ71VVX4Ugk4q2srKzgOK7/tttuO4cQ0s+dO7dlxYoVr9ntdudM8sQvsXagqqru9/v/ZPny5S8Uau2YQoFoZGTkj8vLy/cagdhcQUTgvVQMlEgkvtHY2Hiqra2Nm2sgoir49OnTda2trbf+/Oc/vwEAHOvWrVPGx8eZUCgkcRwnVFZWagghvaOjw3bNNde8zfP8N421w5coRrjk/mKMkc1msy1duvTJoaGhWxFCutmXZdXgChDB14aGhm5cunTpLzmOsxkLkCtgMQCwqVTqv6urq5+Y6xaIqqpLnE7nqiVLlkwEAgFRkiSycuXKdFlZWaatrc3n8XhQZ2fnh3p7e4cNybE3Ho9vLy0t/TS1yGaNJIZBGGNst9tL6urqft3Z2XnnunXrBq22dJHVp+7w4cNLN2zY8IbL5VqT6+SzVNrgqVOnbtu0aVPYSOqa80nxzz77bI3L5WI9Hk9xMBgsYhimzOVyOQkhlRUVFUx5efmvGhsbFQCAU6dO1axdu/aI3W5vyPNQagDAZTKZt5999tmPfe5znxOtXE9kIYgYhBAkEon9JSUld2OMdcPBluvQMcZsMBjcWVtb+5u5zovoQfP5fK6enp4/zWQyaafTGeB5PtrX1xfavn17+tZbb1XMc6Rz9vv9f1pdXf2M8W/5rKkGAFw6nf4vr9f7xStuTamZHwqFvptn2OMiUz+ZTD47X3Nu2traSn/xi1+sPHDgwJbW1tZPt7W1eQDei8WZ013o3JPJ5HN5ugQuCqcEAoEHrFxbxqoE/aGhoW3l5eW781RnlGAjVVWT4XB491zOs6GZlrSBhaH6q15//fV7I5HIuoaGhrLBwcGkoiinRVFUAQDuv/9+3eAu5HdLTFA4HP5HVVUTBsBInnuOy8rKfjw0NHQjQki3wpWCrGjUcOLEibJ169Ydcblc1+QR+rjIzZ9MJn9aWlr6jflg6pvH0aNHywkhNySTyfjw8LDqcDjYuro6KCoqcgYCAZLJZGD9+vXFTqfz9Jo1a2LGx1iEkBaLxX5cVlb2LQsOKwYARhTFd44fP37Htm3bxEs12Xg/rDYGIaRHo9FHXS7XNRhjjWEYLt8JKooSGhsb+wkhBDU1NZE56LkmZ86ccbtcrpWnTp1KDg8Pw7Jly5xVVVVIFEVGFMXhUCjEchxnxxhziUSCAQBSWVlp43nepev6crfb3WPaWA0AoLe3959vuummzzgcjuo8DywDAJrL5dqwfv36RxBC3zNUnP6+SyQqKcbGxj5RW1v7olEKna++1QGATSQS/7usrOzv56g0QgBAOjs76wkh9588eXJQlmWpsrKSlJSUyBzHgaqqRJKkTCwWkxVF0QVBwG63W/d6vYqqqpn6+npcWVnp4nme4XleGR8fx+vXr0c1NTWK2+1+uLy8/HsWUQiiaZrm8/n+YPny5UfycQlweag00tvb6y0vL/8xwzCsUayYp6YkrKqqMZ/P9/O5KI0IIdy+ffuI3+/nBEFIejyevR/5yEfYSCTCBYNBNDw8zI6Pj7MAwBUXF9ttNhvndrsdV199tctut9ucTifrcDg4AOACgQCXSCTs6XTa7nA43KIolgAA293d/cymTZu+ZLPZaoyeBigPwGOO4+xVVVU/7ujouAMAZCNTg7wvEolKikgk8r2KiorvW2DqT5qmPM//W0lJyV/PRWnU09Pz+UQiUdLb2xtkWVYFAMlutxObzYZZlgUAkDVNU1iWJZIkYU3TVEEQVEVRZJfLJRcVFWGWZbHT6ZQZhlHi8bj6xS9+UQUA1NLSwtbW1nI33HCDYOJKmgX0RAMALhqNfqOysvKnua47l2MvItzb27u6uLj4m3k6ycxiltU0TYjH4/81Vy214eHh/UuWLLHLsqyfOXMGa5qGvV4vu3LlShYhJK9cudLucDjsAMCFw2GnqqoOj8fDaZpWqqqqjed5m8fjcbrdbltxcTHn9Xq97e3tNW63+8S6desONjc3awghiMfj/+3xeHbZbDYPtXLztOKI1+v97vnz518EgKFcVBzKMQyCk8nk08XFxX9uga6e5EaZTOZlt9t991xLVJsJFXj77bf/MJPJOGVZjo+MjCilpaUcwzByRUWFVltba0un03IoFErJsmzXNI1zOp1STU0No+s65jguvGnTJp5ayQghnEqlnvd4PPdasf5UoySTycdLS0u/ksv6c7NNXEcI6YODg7cVFRV9msbCrPKwx+PxJ+d4JzlkNKq46Jf79u1jlixZEpYkyTkyMpJGCOHq6mqG4zgyMTGB3nrrLaGurs72oQ99qLqqqiqyefPm89OUjxOjvAmNjY09aQAp77UyaAkuKir6/Ojo6M8RQu/MFkwoh5RZkkqlXvZ4PJ+w6DQQhmGQLMuD77zzzobbb789nivhmyvJfq2trVcPDw8jl8vF1dXVuaLRKCcIQtFVV11V4XA4xl9//fUTAO81MKUAMks3hBBpbW0t2bJlywmXy7XKAt/dpFYQBOFFj8dzT3NzM3v//ffrlkskA6H62NjYHUZesRUvDwzD6ADAKYrSYoBoXuQYT8MtSXt7eyXHcZsdDscEy7IJjHEmk8mkWZZN3Hnnnbz5M3v27JlOKnEIoWQikXjZQiAxAIAdDsfH/X7/tpqamoOzId7MLAkxlJSUfJNlWZsFJI8OFmOM0+n0K+bvmW8DIYQRQuTWW28N3nHHHf/t8/lOVlVV8ZFIxMlx3PUNDQ13d3R02GaSg75v3z4CAJBIJF7SdV23kF4QjuNsHo/nW7PdC2425v7AwMAWp9P5MerzmUm7l5l4sjVNG/T5fIeMBdcB5nfv74MHD67neX7twMBAX2NjY7q/v//U7bff7qcZjZcbVOX09PS8XV1dfY5l2euskErGnhKHw/Hx/v7+zQihozOVSrPpKgYVFRVfsdlsHMYYWwCiyVRQSZIO3HzzzZn5Xm6MECIIIez1ertTqdRbpaWliWQyafN4PI1vvPHGvUeOHPHOtKiBEMLeddddsizLL5vXMs/3A4wxttlsXHV19a7ZSCVmJqcIIYTPnDmzoqio6I+NLviMlVaOKIqv05ym+SyNmpub2cOHD28cHh6+RVGUivr6+mJBEHRVVaMAMLhlyxbBANuMVYogCG9ijLFVa2fsLXE6nZ/s6upaiRDCM1G3zEzBVltb+xm73V5q6ndohTRiVVUNCIJwCiFEmpqa8HyWRvfff7/OsqyjqKiIGx8fV999912loaGBaWxsxF1dXemf/exnK1taWtYfOnSofgYJ/xgAIBqNntE0bcyU220FV8I2m624rq7uswAA27ZtY/I1/xEhBE6ePOm69tpr33Y6nTdYkKV3kbkpiuKBoqKij8+3dBHz2L9/v9fj8RS/9dZbqizL6vr16+0rV64sFQTBFgwGIZlMFiOE2OrqaqfH46kpLi72b9iwofVyuUd0zdLp9G/cbvenLHIO0yavjCRJPe3t7Ru3bdsmZLshZiWRDJOfVFVVbXG5XOsQQtjqbEVFUd6ar1KIqoTly5ffjDH+5Lp16zZv2rRps6Zp13V2dpaOjo7aWJZlVqxYEW5oaBiUZfnMo48+2rxhw4Y3jh496prp90iSdNjK9zbUm26326+55pprthkAYnKWSKZwyL8XFxf/L7AmSHhRJqTP5/tYXV3da/MtLDLVOHLkiDeRSHA8z7vi8TjLMIyzrKzMa7fbHRhjW1FRUUk6neZkWXavXr26BmP8zKZNm8anc9DSNRsaGtpUX19/1AgMWxUVoPnd/+n1ev/ycvvDXc738dRTTxU7nc5PWFwHRwAAybIcjcfjZwEAmpqa5iXBRgiRzs7Ou4eGhqra29tHV6xYQZYuXapXV1er0Wg0MzExIUqSlJAkSdq0aRO5/fbb9UQiIQYCAbJt2zbpMiqF+pPOVVdXj7hcrgYL/XsMAIDD4fh4W1tbJUIocqmIA3c5/btt27bbWZZtsCjKfxHRxhi/Gw6H6QvieUiwwdiMM4QQ2+rVq5XKykrbxMQEGRkZscmyzCxdutRx3XXXuV0uFxeLxdhf//rX+urVq+sbGhq6EUI9l9o8Gntramriv/3tb78LAA0Wxj8Zg3TXXHvttdsA4DfG7/ScrDav13sny7IonzTM6U6Sqqrd27dv1+ax2U8IIWjVqlXjDQ0NqqqqK/r6+lz19fVlV199tau6upqTJImMjIwIkUhEKCoq4r1eb4phGH8mk5FmuuF79uzBmqa9W4DIAAYA5PF4/hBy9GwjhmH05uZml91uv60A5d201KZ7vt9kSVXcqVOnyhFClbIsa+l0mnE4HJhhGEmWZbmkpIQ4HI5MMpkkN9xwA9xyyy3dZqlzqWcfPHiQEu4eIwDOWF3SzzDM7e3t7cUIIX46CcldSrffeOONV7Msu74A/IjFGKuiKPZb5ZW9kv1Hxv89CwBnBwcHSwRBcJ46dYqLxWKuqqoqd11dXTHP8/ZUKuWVJMk1Ojrqr6+vlwzVeEkgbdu2DRuOyQGMscQwjMtinkTsdvuqJUuWrAGA49O5JLhLSQyv13ur3W63W+WfMHwUwDAM6LqeisVig/M5UJttYTU1NYHP59scCARKlyxZEqqsrBR7enqCHMcFli1bltmxY0d6tukzlFu++OKLg1/96lcjHMfVWwgkAADMMAxbVlZ2mwlIs7PaXC7XJvPmW+SjIACAMMb+6667bsy462PeA4lu+I4dO17v6uqybdy4kYtGo6WVlZXVRUVF18iyXOLz+fYTQsSZqLQpNEjiy1/+8ojD4ai38r3p3ttstltnxZGMmBd+6KGHHHa7/UZj862+XREURRkznKhoId2WePPNN6sIIbWlpeVOlmV1l8s1BgATgiAotbW1Uo5rgQCA6Lo+BAC3WSnhaZWK3W5f29raWoIQSk7Fk5ipDw8iDz744DKWZesNVFpuVXEc1/8+d9a9YgbGGOm6fqG4uNiPMa50u93cPffcE8njQCEAAJZlh6kUsdowQgjVrVmzZsV0e8ZM98HS0tIGhmEqjVJeZKWoNKwMPyzQgRCCu++++wLHcWmHw+HkOA4b6SN5PTcej4+Y6IOVQNI5jvO4XK5Gw1JEMwaSw+FYbfiPsIU4mlSTsiwPACzk+3wIEgRhGSFkbPv27eOz5UXT+PyGCiTlae74tYalSGYCJGyIyTVUDFu4epNAdTqdkYV8K5Thle7GGNfR4Hi+z+V5PinLskrNdqvVm8vlWj2dlc1Nhz567aeVRNtYLKQoisrzfAoW+JAkqQpjPGFkVeRjdNBIAY8QSgJAZSGa1uq6vsLIaLisREIIIbJr1y4bxni51V5ngx8hAIgCQAzgdyU3C40jUSGiqqo763f5qB6eYZhkAXxzCADAZrMt37Fjh9eQpmhaIFGyt2vXrhKbzVZtNZAoCeQ4Ll1eXi4sVCDRda6trbWVl5dj8+8gvy5wGV3XhUK9N8uy3umk3UVAampqQgAAoihWMwzjhsKZv9rY2JgGC3woioIURdGtknKPPfaYjDFWCiWRAMBZUVGxbCoBkw0kAACoq6urRAjZChBQJYauVd588015AZv/BACgtbU1eurUqbwtNoQQwRgzPT09iqqqQgF8STRUwi1ZsqRkKlxw0/iQSgwgkUJE5lVVzfzVX/2VuNBvie7t7cUAoFjMY5KF5Haapnlnk4/kNaw1YnXcxuBKCSMQzCyk8Ej2uP76650bN25EFnug+QI4JSexIMty5WVVG/VYEkLchYjK08khhBasWsuSzLYCXCqoFOh1iYGNsstKpG3btlGrwgWF5Qg6LF5Vj5YsWeK0ULWZk/YLNpxOp2PGqk1VVXuB11FfCJmRlxpNTU2ouLjYvmfPHmyxRNKsjkhkBdvZ2XAkrpAJZ4sSCcDj8biSySQuwIHSCqxN2NkkthGKaotzkaBARHDOtU+ura11uVwuO3VGWhUYL4DZPyU2ZgQklmWlAiS0mSfLwsLlRoAQgnA4XEQIUSwIj0zVxq9wnETXtRkDCSGkFlg8MgslV3sqbgQA5MMf/nCpoihRqyUSBVKhpL6iKNplORItbSm0ntV1nYOFS7IJAEA4HC7Sdb0QB7bQa6vNxPwnhmoTCmFVUUuCEGJfqBKJXuxcWlpqF0VRNKpLrAyMOwp5/zHGOHlZIO3bt49ypIQp5cPy7EhN00pMyVdoIfmOAID09/d71q9f//V169atQAjhL3zhC1/p7e1dB/C7DiZ5mOeeQgLJbrcHpxICF730zp07CQBAJBJJYIxV2h/J6mG32927d+92MgxDCvH8K9xiA4xxbUVFxX1Lly7d19/fv9nr9ZKysrI/AAC47rrrUD5tFHVd9xbIj0SxwM8kjQQMIMWpLrQ4FoaMU2O/8847HQsMRLBv3z6astqIECJFRUWrli1b9gtN0z7McRxvHOacJZ1RxOotkMWNMMZaPB5PX1YiUSKoaVoYY5wp1IIyDGNbuXKlDRbYqKqqQgAAHo/nFuNQqRzHrSktLf3LUCh0JB/eaGS2OliWdRRAItE4m5xIJMYvCyQqfV577bWYqqq+QhFiXdeLMMZOczLdQhjUmLHZbB82OXwRy7LBsrKyRL7rvXv37iKWZYsK5QPEGCcdDod/RiESQgizZ88ejWGY4UJl2mGMyxVFKc+TE8zZoev6mHltNU1Lnzx5Us13XVVV9VLVVgiJpGna0Jo1a4QZV9oCAMiyPFaoTDu73e4qKSnx5soJ5jBHAgCAQCDwuKZpCm1Bo6pq9913353ItSyJci9Zlot1XS8tVJk9AIxN19WYuUTpSV+BqjaJkWlXstAk0c6dOzFCCA4fPvyuLMsnaYcXjPHb+XTEo4exsrLSY7PZXFa3CTJVRw9M519kpkOfJEndqqoSq4vtTBJuFSzAXG2MMfPAAw+oqqpSiU80TQsDXBRZgBwT5ZYZDUmxxdU/YKi2M7Mp2aYNLocJIWGrgURfyu1218LCHDSzglNVFTMMg+x2e4U5sRBy989dXaD3ZVVVTRFC+mdTsk0IIWjPnj2jGOOJQllumqYtnythEiuLFGhxYX9//9cHBgbWjI6O3huPxw9b0bnOZrPVFaryhxDi7+zsHJnVe9Km7IlE4glCCNF1XSPWDZ0QQkRR7LB6kwoBIHrRzkwvm5ltf8bsNc+nMTzP868a+6VbtlnG3mcymedn/Z70j4PB4BeN51kOJEVR/C+99NLSKzXltq2tjaOpHc8+++xV+d5Mbrr8D4aHh+8QBOFUOp0+HAqFdh86dGhFvu/78MMPuyRJ6jc2H1u4XxohhEQikYdzARIDAHDu3LlrFEXJEEIIxpa9GyaEEE3TpEAgcKv5++AKufaBvs/OnTvtExMTnxRF0c/z/Ov79+9fTQhhc5VMhBAOACAWi/3CvCCiKAYCgcA3X3jhhSJ6p9tspVFXV9e1qqry5jW2ar80TdNGRkZuymWvEEIImpubXZlM5h2zJLFKKmGMSSwW+6x5ga8kLhQIBB6UJOmYqqoqfenR0dG/zVUNUdW4e/dup7Gmuq7rCiFEJoQQWZajR48erZutuqfv4vf7/0jTNN1iEFEa0tPX11ecExWhLxiLxf6P8VDVwhdUCSEklUr98EoBEt3orq6uZYlE4qksCarpuq5JkhQOBoNf2Lt3r62trY2bjeSgJ3lgYGCtLMtmyaERQvRUKvVyLieerl00Gv1WAffp5znzOPqh0dHRjxUA6ZqB9JcMVYKuFCDxPP+C8Y5KFjfEVMX39vZuzkWtEUKQ3+//iyzeSTnId3PZLAN4KJ1OP10AIGFd1/HExMQnL/duzKVKhhBCcPDgwSOapg3RC+GstFgQQus+9alPlUzVb+f9HM3NzSxCiAwPD29yuVyfAACVEGLL6i1O2yCS5cuX/3BiYuLet956q2wWBBwjhIjL5dqa5ZhlMMaQTCbfmq07hN7hcuDAgSKGYdZZ3PYPAwDSdX08FAq1mVs852xlxOPx/ygE2jVNw4ODg7d80ISbnrR4PP7vM7BSJyXz+Pj4V2ciRQxpxx4/frxCkqSR31nW71lXmUxmqKurq3y2HIQS7d7e3tWqqkoWG0UqIYTwPP+fM9kfZiZRZUEQnjWuBWcsTEbDLMuisrKyW68UFwBCqGYG80MAoBoOQOFyG2/8ux0hpNfX1+90OBzLwGigYcpqfGft2rXx2QZtaQpOSUnJRo7jHBY3jkUYY5xMJn8zk/1hLtetnhCCVFV9W1GU08ZEdYvTbrd+0ACisSOWZQMz2Uhal8dx3A7j78mlmo4ihORwOHxPRUXFd83Xqps6/B7LJ2jr8Xi207idRfFQTAhhZVnuCgaDBy25Bo2K7XA4/LcWOyepY3LwzJkzSz5ILzedo8/n++x0c8QYE/29gQ31hlVVTQ8PD28xrD272fqkzzx27Fi13+9/RJbl5FTOQkVRpKGhoU2zVe/G5sL+/fu9oih2Wbw3GiGExGKxv8/X6/57vpX29vYVsizH6SLmTZDe0+W6rutaOBzebtkL52GxnTp1qkoUxRFqrVyGJ6nGYj+WzSsNog7Hjx9fmkqlTmYfHlMYAwuCMLJ3796i2ap3ulYXLlzYqCiKZNW+0OcoipI8f/781VZUtvwe6U4mk3stJt0qIYTE4/F/+iCBZJ7jyMjIp41QlWYm16IoBnw+30s8z79LXz4Sifzk8ccf9x4+fLgqHA5/zefz7aLP6+zsvF4UxRPGn8pZm4xNZv9DuRgbhh8LwuHwIxbHQ1VCCEkmk7+w3AiiG3z+/PlbDOvAKvRTz+nZ3bt32wE++KuwAAASicQLWaoCa5qmCIIwOD4+/uvx8fGXJyYmvjM6OrohmUz+qyRJ43RC8Xj8UZ/P91lRFAOXCKBqhBASCAT+IdfNMjQFk06n37YwUEulkXTu3LkNBTncdLKpVOq3FupjGndTxsfHN3+QbgATz7F1d3c3ptPpo9MdmHQ6PZhKpY6rqqplgQNPBZgsda4SQkgwGPyhaaNQLntx/vz56zVNy1gYX9MMT/b+gu0FRebY2NgdmqYphjTBForSH5g8wJPe7gKkb2TzGXaqUxcOh386BRhwdszRUCk4S8qqU6wNNrzlJBwO/9T0/SiP4O8jFh9qXVVVZWxsbJtRWl4QqkFzc1AqlWqxagJUJGcymc4DBw64p1qwQpyObH/LgQMHlvj9/u3hcHhXKpV64VKn3CDiMz5IhiSiltBeOp8cSSxCCMFPf/pTRyaTOW4hkDRD2v6WevsLGkowCOlthljXrcwG8Pv9dxNCUHd398bBwcFqQ5UuOX36dJ2V+pqmanR3dzcGAoEvp9Pp/5FledBMMyz0EOt0k8Lh8L8ZTl0mj1QUFuC9nCbjEFq2B4qiyIODgxveF4phCps8U4DTsN9QKz9Mp9MDqVTqG319fTt4nj8+Nja20QpfE80n8vv9X5QkSZhC0qhW+2MwxiQYDDaZQZwvxUgmk7+yUCtohBCSSCR++b7xVHqazp8/v0aW5YRFFhy1FvjBwcF1AAChUOgrRp6OjxCiqaoqGxFylI9koj4enuf/x/huiaZyFCKXR1GUeDgc/nNzBkC+a3/27NmrVVWNWLH21MGqKEq4v79/pTm9+H3zBEej0e9bLZUSicRjAAD9/f0flmU5ZdoU3QiU7jBtyoyzFY1N4AAAjhw5UpvJZM6ZuI7VAxvWz7GOjo4PW3XKTTli/2C1NAqHw3/7vvvyKGqNO+x7LPJjYOMEJ6LR6J/29fXtUBRl3HDmadS8zmQy3cPDwzVTqCuWnlhTNiK1yiZJ++Dg4HpRFDsLkPWZ7Rs79/TTT5dZmLiHCCGora2tUpbl8aksyDzM/XfOnDnjzieNOO/TMTw8fLemaZgQollAUGlaxXgwGHycOvXMZrUsy4GhoaFrhoeHa/x+//a33357yUzed3h4+I9CodATJudhIUBETKGT/8jqTpfvelNP9t9YJI0wIUTXNE0ZHR39SL5Sk8unVzYhhEUIvZRIJH5ZUlLyZUKIPl0f5tnUULEsK8RisR84nc5fSpK0w+VyfZpl2eUcx3HJZPLvV6xYcY7n+eNer/eWsrKygVQq1S1J0lFBEI5kMpnzDodDGx0d1d1u95Jly5b9mdvtXm2323fa7XYnjW4zhWrZa0TwdV0/Y5xu3SIrUz9+/HiF2+1+0KJOdzoAcOl0+sfLli07bOyl/oHWfRnBzvMWnXTKlf4v/Z7HH3/cOzEx8bFQKPS9jo6OktHR0a1TnUpN04gkSUFBEAbT6XSPoiixKZ6NSYEHxpgMDg7+odXcKBqN7rFIGlHfXUd7e3vxB6LSppvk4ODgnZqmqdN4dWctchVF4YeGhm6cytKJxWL/aIrA62YONQ0w1fcLQIalqZ04cWKtFZHz5uZmlhCCTp48uVJRlLA5szIPK02XZTlDS4wK6nzMBUyRSGS3RdkB2TEfzlhQJyEExWKxJwwAiVNIQHwpzzNNXzEBz9IaMANIQnt7+wqr/F5GIPlJi6SRalhpX/ugMy6mVXFbt27leJ5/0aK0Bs0Ibn7ebJkBAAQCgW9NI3X0aWJcetbfvLeiqooNQ8HKXB4iy3Ly0KFD9fkCic53YmLij1VVxbqu63kaNDQP+wlzKorl9ef5Xq15+PBh7cSJEw+KothndKDX8+ylhEtKSn544sSJeiNFlRBC0OHDh/9taGjo3mQy+StFUYaMag/OmA+tdtFNpJShf4MxZhRFGYrH4/914cKFW6PR6Hdp3yYrQ3kMwyALCDZua2urLC8v/2eO44BhmHxuCNAAgBNFsb25ufmvCSHMwYMHMVyJwxSLu1lRlKgFvg7NyAxonk4Mt7S0VIVCobt4nv+xIAgdsixnslJZ04IgnOV5/lfBYPCR8fHxO1taWqro5x966CFHJpM5baFJTWRZFo8dO9aYD0cyRfh/me+7UR+foijDZ86cWXWllclfUhwPDQ3dqyiKmk/owZy/E4lEvm5e4GnSP9gTJ06s9vv9O0Oh0F8Hg8FPHTt2rHHr1q3cVO/Z1dVlN6yhXVZYnFTtKIqinTx5cn2uQKJzDIVCX87X2qTEXJbl5NDQ0K1XFLmexUJ8xUiaz8fsxoQQTZZlaWRk5PZsyWR4e7kZ1JYxJg84MvOXV155pUaW5bBVCWK6rpOenp6tOZZgswAAvb29Nxul3TlbadTo0DRN9fl8911x5DrH6pN8THCdEEIkSRrp7+9feakFoWERCq4Z1p0Bz/MtVvpogsHgn8x246ik6OjoWJbJZPrykZIURKqqkkgk8vkrqVlHLrEh2inj+xY4BKlL4DStSrVCRFOwRaPRx6y0NmdrXlPJ1draWpJKpY7mCWrdKJfSQ6HQX85lEP0emILBoNkrq+ezSZlM5gDNpswXTCZS+49W+MAoEKPR6A9muoF0Ds3NzS5BEF60AkSapmmRSORL8wFEkJ1z7fP5vm0YEPlYcyohhAiC8Fpra2tJvnqf+lLi8XiTRc5U6qv59Qz7ArAAAPv37/cKgvBSnu+gGcRaMudAAcyj66XohILB4OdpF7g8Tp1qSKY3Ozo6avJZMPK7BhI/s0K10c8LgnCYhjemC7DSd3799derBUFozRNEqmExhnw+313mJD6Yh/eVUdfAXbIsB604fZlMprO7u/tGM9/JpZJYEIQDFuVV6YZU6JuuFJ12JwEAOH369A3pdPpdKw6WLMt9Q0NDN847SXSpVFefz7fG5AjM1aKjCxgcHR39JK0OmSlvohv8/PPPl4qiOG6R+Y8NCzN97ty5a7J5nFnVjY2N3SdJUj4HarKwQBCE17q7u5cvCBBlL+Zzzz1XEY/Hn5yuoHC2CfaRSORHLS0ttNchezlnILWU+vv7t9OudBZVj2iEEDIwMHCX+V3ovNva2kpNLRVznbdK551IJP75pptuss0Jj3WhwGRYTF9XFEXIw0Uw6T0XBOHkwMDAHVnmPXMpjhKJRL5biG4eoVDom83NzWxfX5/DlOr7R5lM5t2sTIXZ+odo60T/xMTEZ7J7gi+4YZ78yMjITUaZ9EVNFnIJp6iqqiUSicd7e3tXmwFlIr+T379z506WFnxa2IiBxgj3gqmpRCKReFLTJr9CnY30M0UIiHFgWrq7uxutqE6ZN4Oa4A899JAjFArtVhQllYfPSTMR3ngikfhxX1/ftVM0BuUAAPX09NSIouizuNG5bgDpyLlz59Ynk8l/VxQlnc1rZhl0pTGzUDQafZBaglamgsyLYSakZ8+evZnn+ZenAsdszXCD+MZ4nn9qZGTko0eOHPHCxUUBf2AYapYXA2iaJkmSxOfKhQwAaTR3KpVKPWkKESHL+hbNU1XHmZqmf9bUjYwQQtRZSg2cra4EQTgbi8V+Mj4+fs8TTzxROjY29o0CXJNB8swV181WnCiK7WNjY3dlS/DFMbP412TsKRwO/50sy6N5SCic/Rld14ksyyOSJPktrvXP5m04F3PeUGPno9Hog21tbc7LGQ6LYwbcySCr9eFw+NFMJuOfQvTnctoLXgyQK8gzmcxAIBD4VltbW6UVtyctjiwvMMB75dbBYPCRTCbTNYVfZVZJdKbGoh8EePRsJ2Qmk3knGo0++Pzzz5dmZycsIgEsvbVoElDt7e3FExMTn8lkMq9KkpSeAlTaFSR1zJLnIvDIshzjef63o6Oj977wwgtFcxVAaC5KKABgEUIa/V1fX9+N5eXlO1wu1312u30Nx3H2rKsQiGm+6H2YNzH9gKkAAQAAdF0XRVF8V5Kk5+Lx+MurVq3qyXKS6rnctr048lB5ZvK5a9cu28DAwJZYLLY7nU6/IYoif4nWxlRqXdQ7e4ak21zCpGeVO01p/UmSFM1kMq9EIpHv9Pb23mwG1lTO0rk20DwBFWOUAOnEuAJi69at3E9+8pPlS5cu3eD1ejezLHuTzWZbTghZ6nA42Ble6jLdml1y3RRFURBCflVVL6iqejKVSh2TJOmdxsbGCfpchBC9QYDk3VV/EUgFAxXDMIyWfa9IV1fXsrKysmUMw6yy2WyrXC7XCgC4CiFUY7PZKuC9O0PY9/pYsFOa2bQHNwBohBBZUZQIAAQAYEyW5Quqqp4DgIGJiYnRm266yTeVWjbuDMHzad3nnWPL2CBsllR0HxFCowAwCgBHzJ958skn3ddff32ZpmnlHo+nxOVyFXm9XjfHcZyu65PPIIQooihmotEon8lkEizLxl588cXknj17MpeSlAAATU1NVPJoi8Rknlh+pm5vjBVSmQafs569aLIvUOJOO7wxBvGd8sf4N8Z08+UiYBbH4lgci2NxLI75N/4/EH+4bowJe9MAAAAASUVORK5CYII=" alt="" aria-hidden="true">';
  var WATERMARK_LOGO_URL = 'https://images.squarespace-cdn.com/content/v1/68e3e2b74d7ab5214f499b88/d0f816a6-5802-418f-bd11-37ddd18df645/logo2027transparent.png?format=500w';

  var root = document.getElementById('wd2-venues-root');
  if (!root) return;

  // Paint the whole page section black so the search runs right up to the top, with no patterned strip above it
  var sec = root.closest('section');
  if (sec) {
    sec.style.backgroundColor = '#212e21';
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = '#212e21'; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  }

  if (!document.getElementById('wdvs-search-fonts')) {
    var f = document.createElement('link');
    f.id = 'wdvs-search-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Sansita:wght@400;700&family=Nunito+Sans:wght@400;600;700&display=swap';
    document.head.appendChild(f);
  }

  var css = '\
#wd2-venues-root{--ink:#f7f6ec;--cream:#212e21;--card:#2c3b2c;--sage:#ebfc72;--sage-dark:#f3fdb0;--brass:#ffffff;--rose:#d9a394;--line:#3d503d;--radius:14px;\
font-family:"Nunito Sans","Work Sans",-apple-system,BlinkMacSystemFont,sans-serif;color:var(--ink);background:var(--cream);padding:10px clamp(12px,2.5vw,32px) 56px;box-sizing:border-box;position:relative;overflow:hidden;border:0;border-radius:0}\
#wd2-venues-root .wdvs-watermark{position:absolute;top:50%;left:50%;width:min(1100px,140vw);transform:translate(-50%,-50%);opacity:.05;filter:brightness(0) invert(1);pointer-events:none;z-index:0;user-select:none}\
#wd2-venues-root>.wdvs-head,#wd2-venues-root>.wdvs-filters,#wd2-venues-root>.wdvs-reset,#wd2-venues-root>.wdvs-count,#wd2-venues-root>.wdvs-grid,#wd2-venues-root>.wdvs-empty{position:relative;z-index:1}\
#wd2-venues-root *,#wd2-venues-root *::before,#wd2-venues-root *::after{box-sizing:border-box}\
#wd2-venues-root .wdvs-head{max-width:1600px;margin:0 auto 18px;text-align:center}\
#wd2-venues-root .wdvs-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);font-weight:600;margin-bottom:8px}\
#wd2-venues-root .wdvs-title{font-family:"Sansita",Georgia,serif;font-optical-sizing:auto;font-weight:500;font-size:clamp(28px,4vw,42px);margin:0 0 8px;color:var(--sage-dark)}\
#wd2-venues-root .wdvs-sub{font-size:15px;color:#b7b2a1;margin:0}\
#wd2-venues-root .wdvs-filters{max-width:1600px;margin:0 auto 30px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:20px 22px;display:grid;gap:16px;grid-template-columns:1.3fr 1fr 1fr}\
@media (max-width:720px){#wd2-venues-root .wdvs-filters{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px 12px;padding:16px}#wd2-venues-root .wdvs-filters>.wdvs-field:nth-child(n+3){grid-column:1 / -1}#wd2-venues-root .wdvs-field input[type="text"],#wd2-venues-root .wdvs-field select{min-width:0;text-overflow:ellipsis}}\
#wd2-venues-root .wdvs-field label{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--sage-dark);margin-bottom:7px}\
#wd2-venues-root .wdvs-field input[type="text"],#wd2-venues-root .wdvs-field select{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:16px;background:var(--cream);color:var(--ink)}\
#wd2-venues-root .wdvs-field input[type="text"]:focus,#wd2-venues-root .wdvs-field select:focus{outline:2px solid var(--sage);outline-offset:1px}\
#wd2-venues-root .wdvs-chiprow{display:flex;flex-wrap:wrap;gap:8px}\
#wd2-venues-root .wdvs-chip{-webkit-appearance:none;appearance:none;margin:0;padding:8px 14px;line-height:1.2;border-radius:999px;border:1px solid var(--line);background:var(--cream);background-clip:padding-box;box-shadow:none;text-decoration:none;text-shadow:none;font-size:13px;cursor:pointer;font-family:inherit;color:var(--ink);transition:none;-webkit-tap-highlight-color:transparent;outline:none}\
#wd2-venues-root .wdvs-chip:hover{border-color:var(--sage)}\
#wd2-venues-root .wdvs-chip:focus{outline:none}\
#wd2-venues-root .wdvs-chip:focus-visible{outline:2px solid var(--sage);outline-offset:2px}\
#wd2-venues-root .wdvs-chip::before,#wd2-venues-root .wdvs-chip::after{content:none;display:none}\
#wd2-venues-root .wdvs-chip[aria-pressed="true"]{background:var(--sage);border-color:var(--sage);color:#212e21}\
#wd2-venues-root .wdvs-capacity-row{display:flex;align-items:center;gap:10px}\
#wd2-venues-root .wdvs-capacity-row input[type="range"]{flex:1;accent-color:var(--sage)}\
#wd2-venues-root .wdvs-capacity-val{font-size:13px;font-weight:600;color:var(--sage-dark);min-width:74px;text-align:right}\
#wd2-venues-root .wdvs-reset{max-width:1600px;margin:-14px auto 26px;text-align:right}\
#wd2-venues-root .wdvs-reset button{background:none;border:none;font-family:inherit;font-size:13px;color:var(--brass);cursor:pointer;text-decoration:underline}\
#wd2-venues-root .wdvs-count{max-width:1600px;margin:0 auto 16px;font-size:13px;color:#b7b2a1}\
#wd2-venues-root .wdvs-grid{max-width:1600px;margin:0 auto;display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}\
#wd2-venues-root .wdvs-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;text-decoration:none;color:inherit;transition:transform .18s ease,box-shadow .18s ease;aspect-ratio:auto;max-width:none;margin:0;min-height:0;width:auto;position:relative}\
@media (hover:hover){#wd2-venues-root .wdvs-card.wdvs-live:hover{transform:translateY(-3px);border-color:#ebfc72;box-shadow:0 0 0 2px #ebfc72,0 12px 30px rgba(0,0,0,.45)}#wd2-venues-root .wdvs-card.wdvs-live:hover .wdvs-card-img{transform:scale(1.04)}}#wd2-venues-root .wdvs-card-img{transition:transform .5s}#wd2-venues-root .wdvs-card.wdvs-live:focus-visible{outline:none;box-shadow:0 0 0 3px #ebfc72}\
#wd2-venues-root .wdvs-card.wdvs-soon{cursor:default;opacity:.82}\
#wd2-venues-root .wdvs-card>*{flex-shrink:0}\
#wd2-venues-root .wdvs-card-imgwrap{position:relative;width:100%;height:0;padding-top:75%;overflow:hidden;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%)}\
#wd2-venues-root .wdvs-mark{position:absolute;right:8px;bottom:8px;width:30px;height:auto;max-width:none;margin:0;opacity:.85;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;z-index:1}\
#wd2-venues-root .wdvs-card-img{position:absolute;top:0;left:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;object-fit:cover;display:block}\
#wd2-venues-root .wdvs-card-img-fallback{position:absolute;inset:0;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%);display:flex;align-items:center;justify-content:center;font-family:"Sansita",Georgia,serif;font-size:34px;color:#fff;opacity:.85}\
#wd2-venues-root .wdvs-card-body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:8px;flex:1}\
#wd2-venues-root .wdvs-card-name{font-family:"Sansita",Georgia,serif;font-weight:500;font-size:19px;margin:0;color:var(--sage-dark)}\
#wd2-venues-root .wdvs-card-county{font-size:12.5px;color:#9a9484;letter-spacing:.02em}\
#wd2-venues-root .wdvs-tagrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}\
#wd2-venues-root .wdvs-tag{font-size:11px;padding:4px 9px;border-radius:999px;font-weight:600;letter-spacing:.02em;color:#f4f3e8!important;background:rgba(244,243,232,.1)!important;border:1px solid rgba(244,243,232,.3);-webkit-backdrop-filter:blur(10px) saturate(140%);backdrop-filter:blur(10px) saturate(140%);box-shadow:inset 0 1px 0 rgba(255,255,255,.1);white-space:nowrap}\
#wd2-venues-root .wdvs-tag-cap{border-color:rgba(235,252,114,.55)}\
#wd2-venues-root .wdvs-tag-sitdown{background:#f3e6e2;color:#9a5646}\
#wd2-venues-root .wdvs-tag-casual{background:#e9eef5;color:#3f5c80}\
#wd2-venues-root .wdvs-tag-both{background:#f6ecd9;color:#8a6a2d}\
@media (max-width:640px){#wd2-venues-root .wdvs-card-imgwrap{padding-top:52%}#wd2-venues-root .wdvs-card-body{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;row-gap:4px;padding:12px 14px 14px}#wd2-venues-root .wdvs-card-name,#wd2-venues-root .wdvs-card-county,#wd2-venues-root .wdvs-view,#wd2-venues-root .wdvs-soon-badge{grid-column:1}#wd2-venues-root .wdvs-tagrow{grid-column:2;grid-row:1/span 3;flex-direction:column;align-items:flex-end;justify-content:center;margin:0}#wd2-venues-root .wdvs-grid{gap:14px}}\
#wd2-venues-root .wdvs-soon-badge{margin-top:auto;font-size:12px;font-weight:600;color:var(--brass);letter-spacing:.04em;text-transform:uppercase;padding-top:6px}\
#wd2-venues-root .wdvs-view{margin-top:auto;font-size:12.5px;font-weight:600;color:var(--sage);letter-spacing:.03em}\
#wd2-venues-root .wdvs-empty{max-width:1600px;margin:40px auto;text-align:center;padding:40px 20px;color:#9a9484;font-size:15px}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  root.innerHTML = '<style>@keyframes wd2Shim{0%{background-position:-400px 0}100%{background-position:400px 0}}.wd2-sk{background:#344634 linear-gradient(90deg,rgba(244,243,232,0) 0,rgba(244,243,232,.07) 50%,rgba(244,243,232,0) 100%) no-repeat;background-size:400px 100%;animation:wd2Shim 1.3s ease-in-out infinite;border-radius:14px}@media (prefers-reduced-motion:reduce){.wd2-sk{animation:none}}</style><div style="display:grid;gap:12px"><div class="wd2-sk" style="height:46px;border-radius:999px"></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px"><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div></div></div>';

  fetch(DATA_URL, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (DATA) {
      var VENUES = DATA.venues.map(function (v) {
        var pic = v.cardImg || v.heroImg;
        return {
          name: v.name,
          county: v.location || v.county,
          capacity: Number(v.capacity) || 0,
          foodStyle: v.foodStyle,
          live: !!(v.live && v.url),
          url: v.url,
          img: pic ? (/^https?:/.test(pic) ? pic : DATA.imageBase + pic + '?format=500w') : ''
        };
      });
      build(VENUES);
    })
    .catch(function () {
      root.innerHTML = '<div class="wdvs-empty">Venues could not be loaded. Please refresh the page.</div>';
    });

  function build(VENUES) {
    var counties = Array.from(new Set(VENUES.map(function (v) { return v.county; }))).sort();
    var maxCapacity = Math.max.apply(null, VENUES.map(function (v) { return v.capacity; }).concat([50]));

    root.innerHTML = '\
      <img class="wdvs-watermark" src="' + WATERMARK_LOGO_URL + '" alt="" aria-hidden="true" onerror="this.style.display=\'none\'" />\
      <div class="wdvs-head">\
        <div class="wdvs-eyebrow">Find Your Venue</div>\
        <h2 class="wdvs-title">Search Orcha Events Venues</h2>\
        <p class="wdvs-sub">Filter by location, guest capacity and dining style to find the right fit.</p>\
      </div>\
      <div class="wdvs-filters">\
        <div class="wdvs-field">\
          <label for="wdvs-search">Search by name</label>\
          <input type="text" id="wdvs-search" placeholder="e.g. Dame Tavern" />\
        </div>\
        <div class="wdvs-field">\
          <label for="wdvs-county">Location</label>\
          <select id="wdvs-county"><option value="">All locations</option>' +
            counties.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select>\
        </div>\
        <div class="wdvs-field">\
          <label for="wdvs-capacity">Minimum guest capacity</label>\
          <div class="wdvs-capacity-row">\
            <input type="range" id="wdvs-capacity" min="0" max="' + maxCapacity + '" step="10" value="0" />\
            <span class="wdvs-capacity-val" id="wdvs-capacity-val">Any</span>\
          </div>\
        </div>\
        <div class="wdvs-field" style="grid-column: 1 / -1;">\
          <label>Dining style</label>\
          <div class="wdvs-chiprow" id="wdvs-food-chips">\
            <button type="button" class="wdvs-chip" data-food="" aria-pressed="true">All</button>\
            <button type="button" class="wdvs-chip" data-food="sitdown" aria-pressed="false">Sit-down</button>\
            <button type="button" class="wdvs-chip" data-food="casual" aria-pressed="false">Casual</button>\
            <button type="button" class="wdvs-chip" data-food="both" aria-pressed="false">Both</button>\
          </div>\
        </div>\
      </div>\
      <div class="wdvs-reset"><button type="button" id="wdvs-reset-btn">Reset filters</button></div>\
      <div class="wdvs-count" id="wdvs-count"></div>\
      <div class="wdvs-grid" id="wdvs-grid"></div>\
      <div class="wdvs-empty" id="wdvs-empty" style="display:none;">No venues match those filters yet. Try widening your search.</div>';

    var els = {
      search: root.querySelector('#wdvs-search'),
      county: root.querySelector('#wdvs-county'),
      capacity: root.querySelector('#wdvs-capacity'),
      capacityVal: root.querySelector('#wdvs-capacity-val'),
      chips: Array.prototype.slice.call(root.querySelectorAll('#wdvs-food-chips .wdvs-chip')),
      grid: root.querySelector('#wdvs-grid'),
      empty: root.querySelector('#wdvs-empty'),
      count: root.querySelector('#wdvs-count'),
      reset: root.querySelector('#wdvs-reset-btn')
    };
    var state = { search: '', county: '', minCapacity: 0, food: '' };
    var foodLabel = { sitdown: 'Sit-down', casual: 'Casual', both: 'Sit-down & Casual' };
    var foodTagClass = { sitdown: 'wdvs-tag-sitdown', casual: 'wdvs-tag-casual', both: 'wdvs-tag-both' };

    function matchesFood(venueFood, filter) {
      if (!filter) return true;
      if (filter === 'both') return venueFood === 'both';
      return venueFood === filter || venueFood === 'both';
    }

    function render() {
      var q = state.search.trim().toLowerCase();
      var results = VENUES.filter(function (v) {
        return (!q || v.name.toLowerCase().indexOf(q) !== -1) &&
          (!state.county || v.county === state.county) &&
          (v.capacity >= state.minCapacity) &&
          matchesFood(v.foodStyle, state.food);
      });
      els.count.textContent = results.length + ' venue' + (results.length === 1 ? '' : 's') + ' found';
      els.empty.style.display = results.length ? 'none' : 'block';
      els.grid.innerHTML = results.map(function (v) {
        var imgBlock = '<div class="wdvs-card-imgwrap">' + (v.img
          ? '<img class="wdvs-card-img" src="' + esc(v.img) + '" alt="' + esc(v.name) + '" loading="lazy" onerror="this.outerHTML=\'<div class=&quot;wdvs-card-img-fallback&quot;>' + esc(v.name.charAt(0)) + '</div>\'" />'
          : '<div class="wdvs-card-img-fallback">' + esc(v.name.charAt(0)) + '</div>') + (v.img ? WD2_MARK_TAG : '') + '</div>';
        var inner = imgBlock +
          '<div class="wdvs-card-body">' +
            '<h3 class="wdvs-card-name">' + esc(v.name) + '</h3>' +
            '<div class="wdvs-card-county">' + esc(v.county) + '</div>' +
            '<div class="wdvs-tagrow">' +
              '<span class="wdvs-tag wdvs-tag-cap">Up to ' + v.capacity + ' guests</span>' +
              '<span class="wdvs-tag ' + (foodTagClass[v.foodStyle] || '') + '">' + esc(foodLabel[v.foodStyle] || v.foodStyle) + '</span>' +
            '</div>' +
            (v.live ? '<span class="wdvs-view">View venue →</span>' : '<span class="wdvs-soon-badge">Page coming soon</span>') +
          '</div>';
        return v.live
          ? '<a class="wdvs-card wdvs-live" href="' + esc(v.url) + '">' + inner + '</a>'
          : '<div class="wdvs-card wdvs-soon">' + inner + '</div>';
      }).join('');
    }

    els.search.addEventListener('input', function (e) { state.search = e.target.value; render(); });
    els.county.addEventListener('change', function (e) { state.county = e.target.value; render(); });
    els.capacity.addEventListener('input', function (e) {
      state.minCapacity = Number(e.target.value);
      els.capacityVal.textContent = state.minCapacity === 0 ? 'Any' : state.minCapacity + '+';
      render();
    });
    els.chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        els.chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        state.food = chip.getAttribute('data-food');
        render();
      });
    });
    els.reset.addEventListener('click', function () {
      state = { search: '', county: '', minCapacity: 0, food: '' };
      els.search.value = ''; els.county.value = ''; els.capacity.value = 0;
      els.capacityVal.textContent = 'Any';
      els.chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-food') === '' ? 'true' : 'false'); });
      render();
    });

    render();
  }
})();
