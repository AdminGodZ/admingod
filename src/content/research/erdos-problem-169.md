---
title: "A 2/3 Lower Bound for Progression-Free Harmonic Sums in Terms of van der Waerden Numbers"
problem: "Erdős Problem 169"
summary: "An AI-assisted preprint claiming an explicit lower bound that raises the universal coefficient attached to log W(k) from 1/2 to 2/3 without resolving the full limit question."
field: "Additive combinatorics"
tags:
  - "Arithmetic progressions"
  - "van der Waerden numbers"
  - "Kempner sets"
  - "Harmonic sums"
status: "partial-result"
verification: "unverified"
version: "1.0"
publishedAt: "2026-08-28"
updatedAt: "2026-08-28"
pdf: "/research/erdos-problem-169/paper-v1.0.pdf"
source: "/research/erdos-problem-169/source-v1.0.tex"
externalUrl: "https://www.erdosproblems.com/169"
featured: true
draft: false
---

## The problem

For each integer $k \geq 3$, let $f(k)$ be the supremum of the harmonic sums

$$
\sum_{n \in A}\frac{1}{n}
$$

over sets of positive integers $A$ that contain no $k$-term arithmetic progression. Let $W(k)$ be the two-colour van der Waerden number. Erdős Problem 169 asks how large $f(k)$ can be and, in particular, whether

$$
\lim_{k \to \infty}\frac{f(k)}{\log W(k)}=\infty.
$$

The full limit question remains open.

## What the paper claims

The classical colouring argument gives a universal coefficient of $1/2$. This preprint claims the stronger explicit estimate

$$
f(k) \geq 1+\frac{2W(k)-3}{3W(k)-5}
\left(H_{W(k)-1}-\frac{3}{2}\right),
$$

and therefore

$$
\liminf_{k \to \infty}\frac{f(k)}{\log W(k)} \geq \frac{2}{3}.
$$

If the proof withstands independent checking, this improves one lower-bound constant connected to the problem. It does not prove that the ratio tends to infinity and does not solve Erdős Problem 169.

## Approach

The argument starts from a two-colouring of $[W(k)-1]$ with no monochromatic $k$-term arithmetic progression. Each colour class is normalized and used as the allowed digit set of a shifted Kempner set in base $2W(k)-3$.

The paper then combines four steps:

1. A modular argument shows that the chosen digit sets remain progression-free modulo the base.
2. A digit descent lifts this property to an infinite progression-free set.
3. A leading-digit decomposition turns the harmonic sum into a geometric amplification.
4. A weighted average combines the two colour classes and produces the coefficient $2/3$.

The manuscript also gives an extension to more than two colours, a colouring-sensitive refinement, numerical illustrations, and a proof-audit appendix.

## What still needs checking

This is a non-peer-reviewed preprint. No independent mathematician has verified the proof, and the public Erdős Problems page still lists the constant improvement as open at the date of this release. The status on this page describes the manuscript's claim, not acceptance by the mathematical community.

The main checks are the modular progression lemma, the transition from finite colour classes to infinite digit-restricted sets, and the harmonic-sum estimates used in the final weighted average.

## AI assistance

GPT-5.6 Pro provided substantial help with proof exploration, consistency checks, literature organization, and LaTeX drafting. Tim Held is the sole human author and accepts responsibility for checking every claim. The AI system is not listed as an author.
