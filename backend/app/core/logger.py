import logging
import sys


def _build_logger(name: str) -> logging.Logger:
    log = logging.getLogger(name)
    if log.handlers:
        return log

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S",
        )
    )
    log.addHandler(handler)
    log.setLevel(logging.INFO)
    log.propagate = False
    return log


logger = _build_logger("unfck")
