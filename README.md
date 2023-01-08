# Tic-tac-toe
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

The most common way to code the AI for tic-tac-toe is using a <a href="https://en.wikipedia.org/wiki/Game_tree">game tree</a>. In this project we take a different approach.

Assume that, given a playing strategy S, we can compute the probability of loosing for every possible play, supposing that each player will be using strategy S after this play. With this assumption, we define inductively different playing strategies S_n.

<ul>
  <li><u>Base case</u>: In strategy S_0 the player plays randomly.</li> 
  <li><u>Inductive step</u>: Assume we have defined a strategy S_n. In strategy S_{n+1} the player plays so that it minimizes the probability of loosing assuming that each player will use strategy S_n after this play.</li>
</ul>

The project objective is to see whether S_n, for some n, defines an optimal strategy in tic-tac-toe. It turns out that S_2 is optimal.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

 Open <a href="https://csanabriam.github.io/tic-tac-toe/">`index.html`</a> in a browser. Click on START/RESTART and enter `rndCPU`, `CPU` or `optCPU` on a player's name whether you want the CPU to play with strategy S_0, S_1 or S_2.
 
 In `script.js` the functions `ai.weightPossibleMoves` and `ai.weightPossibleMoves2` define strategies S_1 and S_2.


<!-- CONTRIBUTING -->
## Contributing

<ol>
  <li>Fork the project</li>
  <li>Create your feature branch (`git checkout -b feature/branch_name`)</li>
  <li>Commit your changes (`git commit -m 'Add a feature'`)</li>
  <li>Push to the branch (`git push origin feature/branch_name`)</li>
  <li>Open a Pull Request</li>
</ol>
  
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Camilo Sanabria Malagón- csanabriam@proton.me

Project Link: [https://github.com/csanabriam/tic-tac-toe](https://github.com/csanabriam/tic-tac-toe)

<p align="right">(<a href="#readme-top">back to top</a>)</p>