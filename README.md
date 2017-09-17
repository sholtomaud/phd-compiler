# The Principle of Least Action and the Philosophy of Engineering: Philosophy of Mind

Candidature Doctoral thesis by Mr Sholto Maud

## Usage

Download with git, or npm

## Run watch with

```
>npm run watch
```

## Viewing slides online

Navigate to:

https://gitpitch.com/shotlom/candidate/master


## Config

**config.json** contains information regarding build directory, refernces, citation style, and db directory.

```json
{
  "dbDir":"./db",
  "buildDir":"./build",
  "references": "./references/MyLibrary.json",
  "csl":"./references/styles/acta-philosophica.csl"
}
```

##

Examples, when running from cli:

```
>phd build -c ./config.json -t pdf -s ./thesis/intro.md
>phd build -c config.json -t pdf -s thesis/chapter2/Metaphysica.md
>phd build -c config.json -t pdf -s thesis/1.Introduction.md
```

##

When exporting library from zotero, export as Better CSL JSON.
