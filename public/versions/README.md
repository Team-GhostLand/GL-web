# GhostLand — katalog wersji (CI)

Publiczne archiwum CI jest serwowane z serwera pod:

```
https://ghostland.ovh/modules/ci/
```

Przeglądarka UI: `/versions` (zakładki **modpacks** / **dev-sharing**).

Pliki leżą na hoście w `~/minecraft/_auxiliary/downloads/` i są montowane do Caddy CI (`:2137`).
Nie rejestruj już wpisów ręcznie w panelu admina — wystarczy wrzucić `.mrpack` do odpowiedniego katalogu.
